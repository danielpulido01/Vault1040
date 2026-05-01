import { ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ZodError } from 'zod';
import { config } from '../config/index.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Only log unexpected (non-ApiError) errors — 4xx are expected client errors
  const isExpected = err instanceof ApiError || err instanceof ZodError;
  if (!isExpected) {
    console.error('Error:', err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    err.errors.forEach((error) => {
      const path = error.path.join('.');
      if (!details[path]) {
        details[path] = [];
      }
      details[path].push(error.message);
    });

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
      },
    });
    return;
  }

  // Handle API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: config.nodeEnv === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error',
    },
  });
};
