import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as contactsController from './contacts.controller.js';

const router = Router();

router.post('/', asyncHandler(contactsController.submitContact));

export default router;
