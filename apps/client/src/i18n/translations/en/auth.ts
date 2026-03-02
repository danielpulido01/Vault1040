import type { AuthTranslations } from '../../types';

export const auth: AuthTranslations = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your Vault1040 account',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    createAccount: 'Create account',
    submit: 'Sign In',
    error: 'Login failed',
  },
  register: {
    title: 'Create Account',
    subtitle: 'Join Vault1040 today',
    hasAccount: 'Already have an account?',
    signIn: 'Sign in',
    submit: 'Create Account',
    error: 'Registration failed',
    successTitle: 'Registration Successful!',
    successMessage: 'Please check your email to verify your account.',
    goToLogin: 'Go to Login',
  },
  forgotPassword: {
    title: 'Forgot Password?',
    subtitle: "Enter your email and we'll send you reset instructions.",
    submit: 'Send Reset Link',
    backToLogin: 'Back to Login',
    successTitle: 'Check Your Email',
    successMessage:
      "If an account exists with this email, we've sent password reset instructions.",
  },
  resetPassword: {
    title: 'Reset Password',
    subtitle: 'Enter your new password below.',
    submit: 'Reset Password',
    error: 'Password reset failed',
    invalidLink: 'Invalid Link',
    invalidLinkMessage: 'This password reset link is invalid or has expired.',
    requestNewLink: 'Request New Link',
    successTitle: 'Password Reset!',
    successMessage: 'Your password has been successfully reset.',
    goToLogin: 'Go to Login',
  },
};
