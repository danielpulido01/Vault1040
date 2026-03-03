import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as clientsController from './clients.controller.js';

const router = Router();

// Client CRUD
router.get('/', asyncHandler(clientsController.getClients));
router.get('/:id', asyncHandler(clientsController.getClient));
router.post('/', asyncHandler(clientsController.createClient));
router.put('/:id', asyncHandler(clientsController.updateClient));
router.delete('/:id', asyncHandler(clientsController.deleteClient));

// Sunbiz data
router.post('/:id/sunbiz', asyncHandler(clientsController.upsertSunbizData));
router.get('/:id/sunbiz/:year', asyncHandler(clientsController.getSunbizData));

// Token management
router.post('/:id/generate-token', asyncHandler(clientsController.generateToken));
router.get('/:id/tokens', asyncHandler(clientsController.getTokens));

// Email
router.post('/:id/send-email', asyncHandler(clientsController.sendEmail));

// External payment confirmation
router.post('/:id/confirm-payment', asyncHandler(clientsController.confirmExternalPayment));
router.post('/:id/revoke-payment', asyncHandler(clientsController.revokeExternalPayment));

export default router;
