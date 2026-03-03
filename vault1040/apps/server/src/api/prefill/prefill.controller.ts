import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

export const getPrefillData = async (req: Request, res: Response) => {
  const { token } = req.params;

  const prefillToken = await prisma.prefillToken.findUnique({
    where: { token },
    include: {
      client: true,
    },
  });

  if (!prefillToken) {
    throw ApiError.notFound('Invalid or expired link');
  }

  // Check if token is expired
  if (prefillToken.expiresAt < new Date()) {
    throw ApiError.badRequest('This link has expired. Please contact us for a new link.');
  }

  // Check if already submitted
  if (prefillToken.submittedAt) {
    throw ApiError.badRequest('This annual report has already been submitted.');
  }

  // Get Sunbiz data for the report year
  const sunbizData = await prisma.clientSunbizData.findUnique({
    where: {
      clientId_reportYear: {
        clientId: prefillToken.clientId,
        reportYear: prefillToken.reportYear,
      },
    },
  });

  if (!sunbizData) {
    throw ApiError.notFound('Filing data not found. Please contact support.');
  }

  // Mark token as used (first access) and record IP
  if (!prefillToken.usedAt) {
    await prisma.prefillToken.update({
      where: { id: prefillToken.id },
      data: {
        usedAt: new Date(),
        ipAddress: req.ip,
      },
    });
  }

  res.json({
    success: true,
    data: {
      client: {
        companyName: prefillToken.client.companyName,
        contactEmail: prefillToken.client.contactEmail,
        contactPhone: prefillToken.client.contactPhone,
      },
      sunbizData: {
        documentNumber: sunbizData.documentNumber,
        entityType: sunbizData.entityType,
        businessName: sunbizData.businessName,
        fein: sunbizData.fein,
        principalOffice: sunbizData.principalOffice,
        mailingAddress: sunbizData.mailingAddress,
        registeredAgent: sunbizData.registeredAgent,
        officers: sunbizData.officers,
        llcMembers: sunbizData.llcMembers,
        lpPartners: sunbizData.lpPartners,
      },
      tokenId: prefillToken.id,
      expiresAt: prefillToken.expiresAt,
      // External payment status
      paymentConfirmed: prefillToken.paymentConfirmed,
      externalPaymentMethod: prefillToken.externalPaymentMethod,
    },
  });
};

export const getTokenStatus = async (req: Request, res: Response) => {
  const { tokenId } = req.params;

  const token = await prisma.prefillToken.findUnique({
    where: { id: tokenId },
    select: {
      id: true,
      paymentConfirmed: true,
      externalPaymentMethod: true,
      expiresAt: true,
      submittedAt: true,
    },
  });

  if (!token) {
    throw ApiError.notFound('Token not found');
  }

  res.json({
    success: true,
    data: {
      paymentConfirmed: token.paymentConfirmed,
      paymentMethod: token.externalPaymentMethod,
      isExpired: token.expiresAt < new Date(),
      isSubmitted: !!token.submittedAt,
    },
  });
};
