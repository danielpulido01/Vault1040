import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { hashPassword, comparePassword } from '../../lib/password.js';
import { ApiError } from '../../utils/ApiError.js';

export const getProfile = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    data: { user },
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { firstName, lastName, phone } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone !== undefined && { phone }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    data: { user },
  });
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isValid = await comparePassword(currentPassword, user.passwordHash);

  if (!isValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { passwordHash },
  });

  res.json({
    success: true,
    data: { message: 'Password updated successfully' },
  });
};
