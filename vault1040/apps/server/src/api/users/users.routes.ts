import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import * as usersController from './users.controller.js';

const router = Router();

router.get('/profile', authMiddleware, asyncHandler(usersController.getProfile));
router.put('/profile', authMiddleware, asyncHandler(usersController.updateProfile));
router.put('/password', authMiddleware, asyncHandler(usersController.changePassword));

export default router;
