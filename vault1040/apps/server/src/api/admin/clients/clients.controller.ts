import { Request, Response } from 'express';
import crypto from 'crypto';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../../../lib/prisma.js';
import { ApiError } from '../../../utils/ApiError.js';
import { config } from '../../../config/index.js';
import { sendPrefillInvitationEmail } from '../../../lib/email.js';
import { sunbizUrl } from '../../../lib/sunbiz.js';

const STATE_FEES: Record<string, number> = {
  'profit-corp': 150.0,
  'non-profit-corp': 61.25,
  'llc': 138.75,
  'lp': 500.0,
  'lllp': 500.0,
};
const SERVICE_FEE = 50.0;
const LATE_FEE = 400.0;

function isAfterMay1(): boolean {
  const now = new Date();
  return now > new Date(now.getFullYear(), 4, 1);
}

function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AR-${timestamp}-${random}`;
}

// ============================================
// SUNBIZ LOOKUP
// ============================================

export const sunbizLookup = async (req: Request, res: Response) => {
  const documentNumber = (req.query.documentNumber as string)?.trim();

  if (!documentNumber) {
    throw ApiError.badRequest('documentNumber query param is required');
  }

  res.json({ success: true, data: { url: sunbizUrl(documentNumber) } });
};

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

  // Fetch related annual report filings by document number so the admin
  // can see data the client submitted (registered agent address, LLC members, etc.)
  const relatedFilings = client.documentNumber
    ? await prisma.annualReportFiling.findMany({
        where: { documentNumber: client.documentNumber },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          referenceNumber: true,
          documentNumber: true,
          entityType: true,
          businessName: true,
          fein: true,
          principalOffice: true,
          mailingAddress: true,
          registeredAgent: true,
          officers: true,
          llcMembers: true,
          lpPartners: true,
          status: true,
          createdAt: true,
        },
      })
    : [];

  res.json({
    success: true,
    data: { client: { ...client, relatedFilings } },
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

  const sunbizData = client.sunbizData[0];

  // Generate a unique reference number for the draft filing
  let referenceNumber = generateReferenceNumber();
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.annualReportFiling.findUnique({ where: { referenceNumber } });
    if (!existing) break;
    referenceNumber = generateReferenceNumber();
    attempts++;
  }

  const stateFee = STATE_FEES[sunbizData.entityType] || 0;
  const lateFee = isAfterMay1() && sunbizData.entityType !== 'non-profit-corp' ? LATE_FEE : 0;
  const totalFee = stateFee + SERVICE_FEE + lateFee;

  const [prefillToken] = await prisma.$transaction([
    prisma.prefillToken.create({
      data: {
        token,
        clientId: id,
        reportYear: parseInt(reportYear, 10),
        expiresAt,
        createdBy: req.user!.id,
      },
    }),
  ]);

  // Create a draft filing linked to this token so it appears in the admin filings list
  await prisma.annualReportFiling.create({
    data: {
      referenceNumber,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone ?? null,
      documentNumber: sunbizData.documentNumber,
      entityType: sunbizData.entityType,
      businessName: sunbizData.businessName,
      fein: sunbizData.fein,
      principalOffice: sunbizData.principalOffice as object,
      mailingAddress: sunbizData.mailingAddress as object,
      registeredAgent: sunbizData.registeredAgent as object,
      officers: sunbizData.officers ?? [],
      llcMembers: sunbizData.llcMembers ?? [],
      lpPartners: sunbizData.lpPartners ?? [],
      stateFee: new Decimal(stateFee),
      serviceFee: new Decimal(SERVICE_FEE),
      lateFee: new Decimal(lateFee),
      totalFee: new Decimal(totalFee),
      status: 'LINK_SENT',
      paymentStatus: 'PENDING',
      prefillTokenId: prefillToken.id,
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

export const regenerateToken = async (req: Request, res: Response) => {
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

  const activeTokens = await prisma.prefillToken.findMany({
    where: { clientId: id, reportYear: parseInt(reportYear, 10), submittedAt: null },
    select: { id: true },
  });

  const now = new Date();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const sunbizData = client.sunbizData[0];

  let referenceNumber = generateReferenceNumber();
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.annualReportFiling.findUnique({ where: { referenceNumber } });
    if (!existing) break;
    referenceNumber = generateReferenceNumber();
    attempts++;
  }

  const stateFee = STATE_FEES[sunbizData.entityType] || 0;
  const lateFee = isAfterMay1() && sunbizData.entityType !== 'non-profit-corp' ? LATE_FEE : 0;
  const totalFee = stateFee + SERVICE_FEE + lateFee;
  const activeTokenIds = activeTokens.map((t) => t.id);

  const prefillToken = await prisma.$transaction(async (tx) => {
    if (activeTokenIds.length > 0) {
      await tx.prefillToken.updateMany({
        where: { id: { in: activeTokenIds } },
        data: { expiresAt: now },
      });
      await tx.annualReportFiling.updateMany({
        where: { prefillTokenId: { in: activeTokenIds } },
        data: { status: 'CANCELLED' },
      });
    }

    const newToken = await tx.prefillToken.create({
      data: {
        token,
        clientId: id,
        reportYear: parseInt(reportYear, 10),
        expiresAt,
        createdBy: req.user!.id,
      },
    });

    await tx.annualReportFiling.create({
      data: {
        referenceNumber,
        contactEmail: client.contactEmail,
        contactPhone: client.contactPhone ?? null,
        documentNumber: sunbizData.documentNumber,
        entityType: sunbizData.entityType,
        businessName: sunbizData.businessName,
        fein: sunbizData.fein,
        principalOffice: sunbizData.principalOffice as object,
        mailingAddress: sunbizData.mailingAddress as object,
        registeredAgent: sunbizData.registeredAgent as object,
        officers: sunbizData.officers ?? [],
        llcMembers: sunbizData.llcMembers ?? [],
        lpPartners: sunbizData.lpPartners ?? [],
        stateFee: new Decimal(stateFee),
        serviceFee: new Decimal(SERVICE_FEE),
        lateFee: new Decimal(lateFee),
        totalFee: new Decimal(totalFee),
        status: 'LINK_SENT',
        paymentStatus: 'PENDING',
        prefillTokenId: newToken.id,
      },
    });

    return newToken;
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

// ============================================
// EXTERNAL PAYMENT CONFIRMATION
// ============================================

const VALID_PAYMENT_METHODS = ['cash', 'check', 'subscription', 'wire', 'ach', 'other'];

export const confirmExternalPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tokenId, paymentMethod, notes } = req.body;

  if (!tokenId) {
    throw ApiError.badRequest('Token ID is required');
  }

  if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    throw ApiError.badRequest(
      `Invalid payment method. Must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`
    );
  }

  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    throw ApiError.notFound('Client not found');
  }

  const token = await prisma.prefillToken.findUnique({
    where: { id: tokenId },
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

  const now = new Date();

  // Mark payment as confirmed and update the linked draft filing in one transaction
  const [updatedToken] = await prisma.$transaction([
    prisma.prefillToken.update({
      where: { id: tokenId },
      data: {
        paymentConfirmed: true,
        paymentConfirmedAt: now,
        paymentConfirmedBy: req.user!.id,
        externalPaymentMethod: paymentMethod,
        externalPaymentNotes: notes || null,
      },
    }),
    prisma.annualReportFiling.updateMany({
      where: { prefillTokenId: tokenId },
      data: {
        paymentStatus: 'SUCCEEDED',
        paymentMethod,
        paidAt: now,
        status: 'PAYMENT_RECEIVED',
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      message: 'External payment confirmed. Client can now submit without Stripe payment.',
      token: {
        id: updatedToken.id,
        paymentConfirmed: updatedToken.paymentConfirmed,
        paymentConfirmedAt: updatedToken.paymentConfirmedAt,
        externalPaymentMethod: updatedToken.externalPaymentMethod,
      },
    },
  });
};

export const revokeExternalPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tokenId } = req.body;

  if (!tokenId) {
    throw ApiError.badRequest('Token ID is required');
  }

  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    throw ApiError.notFound('Client not found');
  }

  const token = await prisma.prefillToken.findUnique({
    where: { id: tokenId },
  });

  if (!token) {
    throw ApiError.notFound('Token not found');
  }

  if (token.clientId !== id) {
    throw ApiError.badRequest('Token does not belong to this client');
  }

  if (token.submittedAt) {
    throw ApiError.badRequest('Cannot revoke payment confirmation after submission');
  }

  // Revoke payment confirmation and revert the linked draft filing in one transaction
  const [updatedToken] = await prisma.$transaction([
    prisma.prefillToken.update({
      where: { id: tokenId },
      data: {
        paymentConfirmed: false,
        paymentConfirmedAt: null,
        paymentConfirmedBy: null,
        externalPaymentMethod: null,
        externalPaymentNotes: null,
      },
    }),
    prisma.annualReportFiling.updateMany({
      where: { prefillTokenId: tokenId },
      data: {
        paymentStatus: 'PENDING',
        paymentMethod: null,
        paidAt: null,
        status: 'LINK_SENT',
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      message: 'External payment confirmation revoked.',
      token: {
        id: updatedToken.id,
        paymentConfirmed: updatedToken.paymentConfirmed,
      },
    },
  });
};
