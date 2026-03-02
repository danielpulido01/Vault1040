import crypto from 'crypto';
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CreateBookingInput {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}

// Helper to generate time slots
function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`);

    currentMinute += intervalMinutes;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }

  return slots;
}

// Add minutes to time string
function addMinutesToTime(time: string, minutes: number): string {
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + minutes;
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;
  return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
}

// Check if two time ranges overlap
function timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  return start1 < end2 && end1 > start2;
}

export const getAvailableSlots = async (date: Date, serviceId: string): Promise<TimeSlot[]> => {
  // Get service duration
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw ApiError.notFound('Service not found');
  }

  const dayOfWeek = date.getDay();

  // Get availability schedule for this day
  const schedule = await prisma.availabilitySchedule.findFirst({
    where: { dayOfWeek, isActive: true },
  });

  if (!schedule) {
    return []; // Closed on this day
  }

  // Check if date is blocked
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const isBlocked = await prisma.blockedDate.findFirst({
    where: { date: startOfDay },
  });

  if (isBlocked) {
    return []; // Date is blocked
  }

  // Generate all possible slots (30-minute intervals)
  const allSlots = generateTimeSlots(schedule.startTime, schedule.endTime, 30);

  // Get existing bookings for this date
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await prisma.booking.findMany({
    where: {
      scheduledDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  // Mark slots as available or not
  return allSlots.map((slotTime) => {
    const slotEndTime = addMinutesToTime(slotTime, service.duration);

    // Check if slot would end after business hours
    if (slotEndTime > schedule.endTime) {
      return { time: slotTime, available: false };
    }

    // Check for conflicts with existing bookings
    const hasConflict = existingBookings.some((booking) =>
      timesOverlap(slotTime, slotEndTime, booking.scheduledTime, booking.endTime)
    );

    return { time: slotTime, available: !hasConflict };
  });
};

export const createBooking = async (input: CreateBookingInput) => {
  const service = await prisma.service.findUnique({
    where: { id: input.serviceId },
  });

  if (!service) {
    throw ApiError.notFound('Service not found');
  }

  // Verify slot is still available
  const date = new Date(input.scheduledDate);
  const availableSlots = await getAvailableSlots(date, input.serviceId);
  const selectedSlot = availableSlots.find((s) => s.time === input.scheduledTime);

  if (!selectedSlot?.available) {
    throw ApiError.conflict('This time slot is no longer available');
  }

  // Calculate end time
  const endTime = addMinutesToTime(input.scheduledTime, service.duration);

  // Generate confirmation code
  const confirmationCode = generateConfirmationCode();

  // Create booking with transaction to prevent race conditions
  const booking = await prisma.$transaction(async (tx) => {
    // Double-check availability within transaction
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingBooking = await tx.booking.findFirst({
      where: {
        scheduledDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        scheduledTime: input.scheduledTime,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (conflictingBooking) {
      throw ApiError.conflict('This time slot is no longer available');
    }

    return tx.booking.create({
      data: {
        userId: input.userId || null,
        guestEmail: input.userId ? null : input.email,
        guestFirstName: input.userId ? null : input.firstName,
        guestLastName: input.userId ? null : input.lastName,
        guestPhone: input.userId ? null : input.phone,
        serviceId: input.serviceId,
        scheduledDate: startOfDay,
        scheduledTime: input.scheduledTime,
        endTime,
        duration: service.duration,
        status: 'PENDING',
        notes: input.notes,
        confirmationCode,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            duration: true,
          },
        },
      },
    });
  });

  // TODO: Send confirmation email

  return booking;
};

export const getUserBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
          duration: true,
        },
      },
    },
    orderBy: { scheduledDate: 'desc' },
  });

  return bookings;
};

export const getBookingById = async (id: string, userId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id, userId },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
          duration: true,
        },
      },
    },
  });

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  return booking;
};

export const getBookingByCode = async (code: string) => {
  const booking = await prisma.booking.findUnique({
    where: { confirmationCode: code },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
          duration: true,
        },
      },
    },
  });

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  return booking;
};

export const cancelBooking = async (id: string, userId: string, reason?: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id, userId },
  });

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  if (booking.status === 'CANCELLED') {
    throw ApiError.badRequest('Booking is already cancelled');
  }

  if (booking.status === 'COMPLETED') {
    throw ApiError.badRequest('Cannot cancel a completed booking');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
      cancellationReason: reason,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
          duration: true,
        },
      },
    },
  });

  // TODO: Send cancellation email

  return updatedBooking;
};

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `V1040-${segment1}-${segment2}`;
}
