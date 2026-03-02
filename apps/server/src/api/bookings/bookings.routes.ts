import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.middleware.js';
import * as bookingsController from './bookings.controller.js';

const router = Router();

router.get('/available-slots', asyncHandler(bookingsController.getAvailableSlots));
router.post('/', optionalAuthMiddleware, asyncHandler(bookingsController.createBooking));
router.get('/', authMiddleware, asyncHandler(bookingsController.getUserBookings));
router.get('/confirmation/:code', asyncHandler(bookingsController.getBookingByCode));
router.get('/:id', authMiddleware, asyncHandler(bookingsController.getBookingById));
router.post('/:id/cancel', authMiddleware, asyncHandler(bookingsController.cancelBooking));

export default router;
