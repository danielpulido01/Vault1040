import { Request, Response } from 'express';
import * as authService from './auth.service.js';
import type { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from './auth.validation.js';

export const register = async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const user = await authService.register(input);

  res.status(201).json({
    success: true,
    data: {
      user,
      message: 'Registration successful. Please check your email to verify your account.',
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const result = await authService.login(input);

  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  await authService.logout(req.user!.id, refreshToken);

  res.clearCookie('refreshToken');

  res.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No refresh token provided' },
    });
    return;
  }

  const result = await authService.refresh(refreshToken);

  // Set new refresh token
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as ForgotPasswordInput;
  await authService.forgotPassword(email);

  // Always return success to not reveal if email exists
  res.json({
    success: true,
    data: { message: 'If an account exists with this email, a password reset link has been sent.' },
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body as ResetPasswordInput;
  await authService.resetPassword(token, password);

  res.json({
    success: true,
    data: { message: 'Password reset successfully. You can now log in with your new password.' },
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);

  res.json({
    success: true,
    data: { user },
  });
};
