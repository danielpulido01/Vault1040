import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAllServices = async (_req: Request, res: Response) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      duration: true,
      price: true,
    },
  });

  res.json({
    success: true,
    data: { services },
  });
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const service = await prisma.service.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      duration: true,
      price: true,
    },
  });

  if (!service) {
    throw ApiError.notFound('Service not found');
  }

  res.json({
    success: true,
    data: { service },
  });
};
