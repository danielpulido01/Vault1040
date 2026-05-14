import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { optionalAuthMiddleware, authMiddleware } from '../../middleware/auth.middleware.js';
import * as llcFormationsController from './llc-formations.controller.js';

const router = Router();

// Submit a new LLC formation (guests allowed)
router.post('/', optionalAuthMiddleware, asyncHandler(llcFormationsController.submitFormation));

// Get user's formations (authenticated users only)
router.get('/', authMiddleware, asyncHandler(llcFormationsController.getFormations));

// Get specific formation by ID
router.get('/:id', optionalAuthMiddleware, asyncHandler(llcFormationsController.getFormation));

export default router;
