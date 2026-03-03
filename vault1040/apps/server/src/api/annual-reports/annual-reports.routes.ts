import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { optionalAuthMiddleware, authMiddleware } from '../../middleware/auth.middleware.js';
import * as annualReportsController from './annual-reports.controller.js';

const router = Router();

// Submit a new annual report filing (guests allowed)
router.post('/', optionalAuthMiddleware, asyncHandler(annualReportsController.submitFiling));

// Get user's filings (authenticated users only)
router.get('/', authMiddleware, asyncHandler(annualReportsController.getFilings));

// Get specific filing by ID
router.get('/:id', optionalAuthMiddleware, asyncHandler(annualReportsController.getFiling));

export default router;
