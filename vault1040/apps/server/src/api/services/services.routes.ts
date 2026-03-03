import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as servicesController from './services.controller.js';

const router = Router();

router.get('/', asyncHandler(servicesController.getAllServices));
router.get('/:slug', asyncHandler(servicesController.getServiceBySlug));

export default router;
