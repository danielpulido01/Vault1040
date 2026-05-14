import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import {
  getFormations,
  getFormationStats,
  getFormation,
  updateFormation,
} from './llc-formations.controller.js';

const router = Router();

router.get('/stats', asyncHandler(getFormationStats));
router.get('/', asyncHandler(getFormations));
router.get('/:id', asyncHandler(getFormation));
router.patch('/:id', asyncHandler(updateFormation));

export default router;
