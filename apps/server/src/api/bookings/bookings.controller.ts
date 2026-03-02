import { Request, Response } from 'express';
import * as bookingsService from './bookings.service.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAvailableSlots = async (req: Request, res: Response) => {
  const { date, serviceId } = req.query;

  if (!date || !serviceId) {
    throw ApiError.badRequest('Date and serviceId are required');
  }

  const slots = await bookingsService.getAvailableSlots(
    new Date(date as string),
    serviceId as string
  );

  res.json({
    success: true,
    data: { slots },
  });
};

export const createBooking = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const booking = await bookingsService.createBooking({
    ...req.body,
    userId,
  });

  res.status(201).json({
    success: true,
    data: { booking },
  });
};

export const getUserBookings = async (req: Request, res: Response) => {
  const bookings = await bookingsService.getUserBookings(req.user!.id);

  res.json({
    success: true,
    data: { bookings },
  });
};

export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await bookingsService.getBookingById(id, req.user!.id);

  res.json({
    success: true,
    data: { booking },
  });
};

export const getBookingByCode = async (req: Request, res: Response) => {
  const { code } = req.params;
  const booking = await bookingsService.getBookingByCode(code);

  res.json({
    success: true,
    data: { booking },
  });
};

export const cancelBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const booking = await bookingsService.cancelBooking(id, req.user!.id, reason);

  res.json({
    success: true,
    data: { booking },
  });
};
