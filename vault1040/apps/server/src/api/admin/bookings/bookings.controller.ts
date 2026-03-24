import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma.js';

export const getBookings = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || '';
  const status = req.query.status as string;

  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { guestEmail: { contains: search, mode: 'insensitive' } },
      { guestFirstName: { contains: search, mode: 'insensitive' } },
      { guestLastName: { contains: search, mode: 'insensitive' } },
      { confirmationCode: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { scheduledDate: 'desc' },
      include: {
        service: { select: { id: true, name: true, duration: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

export const getBookingStats = async (_req: Request, res: Response) => {
  const [total, pending, confirmed, completed, cancelled] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'COMPLETED' } }),
    prisma.booking.count({ where: { status: 'CANCELLED' } }),
  ]);

  res.json({
    success: true,
    data: { total, pending, confirmed, completed, cancelled },
  });
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (status === 'CANCELLED') updateData.cancelledAt = new Date();
  if (notes !== undefined) updateData.notes = notes;

  const updated = await prisma.booking.update({
    where: { id },
    data: updateData,
    include: {
      service: { select: { id: true, name: true, duration: true } },
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  res.json({ success: true, data: { booking: updated } });
};
