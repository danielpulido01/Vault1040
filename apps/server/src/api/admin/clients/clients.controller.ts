import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../../../lib/prisma.js';
import { ApiError } from '../../../utils/ApiError.js';
import { config } from '../../../config/index.js';
import { sendPrefillInvitationEmail } from '../../../lib/email.js';

// ============================================
// CLIENT CRUD
// ============================================

export const getClients = async (req: Request, res: Response) => {
  const { search, page = '1', limit = '20' } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const where = search
    ? {
        OR: [
          { companyName: { contains: search as string, mode: 'insensitive' as const } },
          { contactEmail: { contains: search as string, mode: 'insensitive' as const } },
          { documentNumber: { contains: search as string, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        sunbizData: {
          orderBy: { reportYear: 'desc' },
          take: 1,
        },
        prefillTokens: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
    prisma.client.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      clients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
};

export const getClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      sunbizData: {
        orderBy: { reportYear: 'desc' },
      },
      prefillTokens: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!client) {
    throw ApiError.notFound('Client not found');
  }

  res.json({
    success: true,
    data: { client },
  });
};

export const createClient = async (req: Request, res: Response) => {
  const { companyName, contactEmail, contactPhone, documentNumber, fein, notes } = req.body;

  // Check for duplicate document number
  if (documentNumber) {
    const existing = await prisma.client.findUnique({
      where: { documentNumber },
    });
    if (existing) {
      throw ApiError.conflict('A client with this document number already exists');
    }
  }

  const client = await prisma.client.create({
    data: {
      companyName,
      contactEmail,
      contactPhone,
      documentNumber,
      fein,
      notes,
      createdBy: req.user!.id,
    },
  });

  res.status(201).json({
    success: true,
    data: { client },
  });
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { companyName, contactEmail, contactPhone, documentNumber, fein, notes } = req.body;

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Client not found');
  }

  // Check for duplicate document number if changing
  if (documentNumber && documentNumber !== existing.documentNumber) {
    const duplicate = await prisma.client.findUnique({
      where: { documentNumber },
    });
    if (duplicate) {
      throw ApiError.conflict('A client with this document number already exists');
    }
  }

  const client = await prisma.client.update({
    where: { id },
    data: {
      companyName,
      contactEmail,
      contactPhone,
      documentNumber,
      fein,
      notes,
    },
  });

  res.json({
    success: true,
    data: { client },
  });
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Client not found');
  }

  await prisma.client.delete({ where: { id } });

  res.json({
    success: true,
    data: { message: 'Client deleted successfully' },
  });
};

// ============================================
// SUNBIZ DATA
// ============================================

export const upsertSunbizData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    reportYear,
    documentNumber,
    entityType,
    businessName,
    fein,
    principalOffice,
    mailingAddress,
    registeredAgent,
    officers,
    llcMembers,
    lpPartners,
  } = req.body;

  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    throw ApiError.notFound('Client not found');
  }

  const sunbizData = await prisma.clientSunbizData.upsert({
    where: {
      clientId_reportYear: {
        clientId: id,
        reportYear: parseInt(reportYear, 10),
      },
    },
    update: {
      documentNumber,
      entityType,
      businessName,
      fein,
      principalOffice,
      mailingAddress,
      registeredAgent,
      officers: officers || [],
      llcMembers: llcMembers || [],
      lpPartners: lpPartners || [],
    },
    create: {
      clientId: id,
      reportYear: parseInt(reportYear, 10),
      documentNumber,
      entityType,
      businessName,
      fein,
      principalOffice,
      mailingAddress,
      registeredAgent,
      officers: officers || [],
      llcMembers: llcMembers || [],
      lpPartners: lpPartners || [],
      enteredBy: req.user!.id,
    },
  });

  // Also update client's document number and fein if not set
  if (!client.documentNumber || !client.fein) {
    await prisma.client.update({
      where: { id },
      data: {
        documentNumber: client.documentNumber || documentNumber,
        fein: client.fein || fein,
      },
    });
  }

  res.json({
    success: true,
    data: { sunbizData },
  });
};

export const getSunbizData = async (req: Request, res: Response) => {
  const { id, year } = req.params;

  const sunbizData = await prisma.clientSunbizData.findUnique({
    where: {
      clientId_reportYear: {
        clientId: id,
        reportYear: parseInt(year, 10),
      },
    },
  });

  if (!sunbizData) {
    throw ApiError.notFound('Sunbiz data not found for this year');
  }

  res.json({
    success: true,
    data: { sunbizData },
  });
};

// ============================================
// TOKEN GENERATION
// ============================================

export const generateToken = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reportYear } = req.body;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      sunbizData: {
        where: { reportYear: parseInt(reportYear, 10) },
      },
    },
  });

  if (!client) {
    throw ApiError.notFound('Client not found');
  }

  if (client.sunbizData.length === 0) {
    throw ApiError.badRequest('No Sunbiz data found for this year. Please add Sunbiz data first.');
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');

  // Token expires in 30 days
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const prefillToken = await prisma.prefillToken.create({
    data: {
      token,
      clientId: id,
      reportYear: parseInt(reportYear, 10),
      expiresAt,
      createdBy: req.user!.id,
    },
  });

  const prefillUrl = `${config.clientUrl}/annual-report?token=${token}`;

  res.status(201).json({
    success: true,
    data: {
      token: prefillToken.token,
      prefillUrl,
      expiresAt: prefillToken.expiresAt,
    },
  });
};

export const getTokens = async (req: Request, res: Response) => {
  const { id } = req.params;

  const tokens = await prisma.prefillToken.findMany({
    where: { clientId: id },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: { tokens },
  });
};

// ============================================
// EMAIL
// ============================================

export const sendEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tokenId } = req.body;

  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    throw ApiError.notFound('Client not found');
  }

  const token = await prisma.prefillToken.findUnique({
    where: { id: tokenId },
    include: {
      client: {
        include: {
          sunbizData: true,
        },
      },
    },
  });

  if (!token) {
    throw ApiError.notFound('Token not found');
  }

  if (token.clientId !== id) {
    throw ApiError.badRequest('Token does not belong to this client');
  }

  if (token.submittedAt) {
    throw ApiError.badRequest('This report has already been submitted');
  }

  const sunbizData = token.client.sunbizData.find(
    (s) => s.reportYear === token.reportYear
  );

  if (!sunbizData) {
    throw ApiError.badRequest('No Sunbiz data found for this token');
  }

  const prefillUrl = `${config.clientUrl}/annual-report?token=${token.token}`;

  const result = await sendPrefillInvitationEmail({
    to: client.contactEmail,
    clientName: client.companyName,
    businessName: sunbizData.businessName,
    reportYear: token.reportYear,
    prefillUrl,
    expiresAt: token.expiresAt,
  });

  if (!result.success) {
    throw ApiError.internal(result.error || 'Failed to send email');
  }

  // Update token with email sent timestamp
  await prisma.prefillToken.update({
    where: { id: tokenId },
    data: {
      emailSentAt: new Date(),
      emailId: result.messageId,
    },
  });

  res.json({
    success: true,
    data: { message: 'Email sent successfully', messageId: result.messageId },
  });
};
