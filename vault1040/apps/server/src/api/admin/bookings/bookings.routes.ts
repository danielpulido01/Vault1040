import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as bookingsController from './bookings.controller.js';

const router = Router();

router.get('/', asyncHandler(bookingsController.getBookings));
router.get('/stats', asyncHandler(bookingsController.getBookingStats));
router.patch('/:id/status', asyncHandler(bookingsController.updateBookingStatus));

export default router;
