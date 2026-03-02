import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { errorHandler } from './middleware/error.middleware.js';

// Import routes
import authRoutes from './api/auth/auth.routes.js';
import userRoutes from './api/users/users.routes.js';
import bookingRoutes from './api/bookings/bookings.routes.js';
import contactRoutes from './api/contacts/contacts.routes.js';
import serviceRoutes from './api/services/services.routes.js';
import annualReportRoutes from './api/annual-reports/annual-reports.routes.js';
import adminRoutes from './api/admin/admin.routes.js';
import prefillRoutes from './api/prefill/prefill.routes.js';
import paymentRoutes from './api/payments/payments.routes.js';
import { handleWebhook } from './api/payments/payments.webhook.js';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
});

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(cookieParser());

// Stripe webhook needs raw body - must be before express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());
app.use(limiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/annual-reports', annualReportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prefill', prefillRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Endpoint not found' },
  });
});

// Error handler
app.use(errorHandler);

export default app;
