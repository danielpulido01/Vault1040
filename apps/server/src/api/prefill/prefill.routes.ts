import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as prefillController from './prefill.controller.js';

const router = Router();

// Public endpoint - no auth required
router.get('/:token', asyncHandler(prefillController.getPrefillData));

export default router;
