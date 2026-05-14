import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma.js';

export const getFormations = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || '';
  const status = req.query.status as string;
  const paymentStatus = req.query.paymentStatus as string;

  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { llcName: { contains: search, mode: 'insensitive' } },
      { contactEmail: { contains: search, mode: 'insensitive' } },
      { referenceNumber: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  const [formations, total] = await Promise.all([
    prisma.lLCFormation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        referenceNumber: true,
        contactEmail: true,
        llcName: true,
        managementType: true,
        totalFee: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        paymentLast4: true,
        paidAt: true,
        createdAt: true,
        processedAt: true,
      },
    }),
    prisma.lLCFormation.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      formations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

export const getFormationStats = async (_req: Request, res: Response) => {
  const [total, pending, paymentReceived, inProgress, submitted, completed, revenue] =
    await Promise.all([
      prisma.lLCFormation.count(),
      prisma.lLCFormation.count({ where: { status: 'PENDING' } }),
      prisma.lLCFormation.count({ where: { status: 'PAYMENT_RECEIVED' } }),
      prisma.lLCFormation.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.lLCFormation.count({ where: { status: 'SUBMITTED' } }),
      prisma.lLCFormation.count({ where: { status: 'COMPLETED' } }),
      prisma.lLCFormation.aggregate({
        where: { paymentStatus: 'SUCCEEDED' },
        _sum: { totalFee: true },
      }),
    ]);

  res.json({
    success: true,
    data: {
      total,
      pending,
      paymentReceived,
      inProgress,
      submitted,
      completed,
      totalRevenue: revenue._sum.totalFee || 0,
    },
  });
};

export const getFormation = async (req: Request, res: Response) => {
  const { id } = req.params;

  const formation = await prisma.lLCFormation.findUnique({ where: { id } });

  if (!formation) {
    return res.status(404).json({ success: false, error: 'Formation not found' });
  }

  res.json({ success: true, data: { formation } });
};

export const updateFormation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, paymentStatus, paymentMethod } = req.body;

  const formation = await prisma.lLCFormation.findUnique({ where: { id } });

  if (!formation) {
    return res.status(404).json({ success: false, error: 'Formation not found' });
  }

  const updateData: Record<string, unknown> = {};

  if (status) {
    updateData.status = status;
    if (status === 'COMPLETED' || status === 'SUBMITTED') {
      updateData.processedAt = new Date();
      updateData.processedBy = req.user?.id;
    }
  }

  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus;
    if (paymentStatus === 'SUCCEEDED' && !formation.paidAt) {
      updateData.paidAt = new Date();
      if (!status && formation.status === 'PENDING') {
        updateData.status = 'PAYMENT_RECEIVED';
      }
    }
  }

  if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;

  const updated = await prisma.lLCFormation.update({
    where: { id },
    data: updateData,
  });

  res.json({ success: true, data: { formation: updated } });
};
