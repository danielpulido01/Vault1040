import { Router } from 'express';
import {
  getFilings,
  getFilingStats,
  getFiling,
  updateFilingStatus,
} from './filings.controller.js';

const router = Router();

// GET /admin/filings/stats - Get filing statistics
router.get('/stats', getFilingStats);

// GET /admin/filings - List all filings with pagination
router.get('/', getFilings);

// GET /admin/filings/:id - Get single filing details
router.get('/:id', getFiling);

// PATCH /admin/filings/:id - Update filing status
router.patch('/:id', updateFilingStatus);

export default router;
