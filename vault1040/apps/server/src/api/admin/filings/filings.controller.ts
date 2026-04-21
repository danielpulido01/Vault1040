import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma.js';

export const getFilings = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || '';
  const status = req.query.status as string;
  const paymentStatus = req.query.paymentStatus as string;

  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { businessName: { contains: search, mode: 'insensitive' } },
      { contactEmail: { contains: search, mode: 'insensitive' } },
      { documentNumber: { contains: search, mode: 'insensitive' } },
      { referenceNumber: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (paymentStatus) {
    where.paymentStatus = paymentStatus;
  }

  const [filings, total] = await Promise.all([
    prisma.annualReportFiling.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        referenceNumber: true,
        contactEmail: true,
        documentNumber: true,
        entityType: true,
        businessName: true,
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
    prisma.annualReportFiling.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      filings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

export const getFilingStats = async (_req: Request, res: Response) => {
  const [
    totalFilings,
    linkSentFilings,
    pendingFilings,
    paymentReceivedFilings,
    inProgressFilings,
    completedFilings,
    totalRevenue,
  ] = await Promise.all([
    prisma.annualReportFiling.count(),
    prisma.annualReportFiling.count({ where: { status: 'LINK_SENT' } }),
    prisma.annualReportFiling.count({ where: { status: 'PENDING' } }),
    prisma.annualReportFiling.count({ where: { status: 'PAYMENT_RECEIVED' } }),
    prisma.annualReportFiling.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.annualReportFiling.count({ where: { status: 'COMPLETED' } }),
    prisma.annualReportFiling.aggregate({
      where: { paymentStatus: 'SUCCEEDED' },
      _sum: { totalFee: true },
    }),
  ]);

  res.json({
    success: true,
    data: {
      totalFilings,
      linkSentFilings,
      pendingFilings,
      paymentReceivedFilings,
      inProgressFilings,
      completedFilings,
      totalRevenue: totalRevenue._sum.totalFee || 0,
    },
  });
};

export const getFiling = async (req: Request, res: Response) => {
  const { id } = req.params;

  const filing = await prisma.annualReportFiling.findUnique({
    where: { id },
  });

  if (!filing) {
    return res.status(404).json({
      success: false,
      error: 'Filing not found',
    });
  }

  res.json({
    success: true,
    data: { filing },
  });
};

export const updateFilingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const filing = await prisma.annualReportFiling.findUnique({
    where: { id },
  });

  if (!filing) {
    return res.status(404).json({
      success: false,
      error: 'Filing not found',
    });
  }

  const updateData: Record<string, unknown> = {};

  if (status) {
    updateData.status = status;
    if (status === 'COMPLETED' || status === 'SUBMITTED') {
      updateData.processedAt = new Date();
      updateData.processedBy = req.user?.id;
    }
  }

  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }

  const updatedFiling = await prisma.annualReportFiling.update({
    where: { id },
    data: updateData,
  });

  res.json({
    success: true,
    data: { filing: updatedFiling },
  });
};
