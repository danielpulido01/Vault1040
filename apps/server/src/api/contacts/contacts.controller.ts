import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';

export const submitContact = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, subject, message, serviceInterest } = req.body;

  const contact = await prisma.contactSubmission.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      serviceInterest,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    select: {
      id: true,
      createdAt: true,
    },
  });

  // TODO: Send notification email to admin

  res.status(201).json({
    success: true,
    data: {
      id: contact.id,
      message: 'Thank you for contacting us. We will get back to you soon.',
    },
  });
};
