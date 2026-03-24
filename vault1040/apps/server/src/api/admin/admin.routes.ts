import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware.js';
import clientsRoutes from './clients/clients.routes.js';
import filingsRoutes from './filings/filings.routes.js';
import bookingsRoutes from './bookings/bookings.routes.js';

const router = Router();

// All admin routes require authentication and admin/staff role
router.use(authMiddleware);
router.use(adminMiddleware);

// Mount sub-routes
router.use('/clients', clientsRoutes);
router.use('/filings', filingsRoutes);
router.use('/bookings', bookingsRoutes);

export default router;
