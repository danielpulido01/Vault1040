import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { useTranslation } from '@/i18n';

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const resetPasswordSchema = z.object({
    password: z.string().min(8, t.common.validation.passwordMin),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.common.validation.passwordMismatch,
    path: ['confirmPassword'],
  });

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError('');
    try {
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || t.auth.resetPassword.error);
    }
  };

  if (!token) {
    return (
      <section className="flex min-h-[calc(100vh-200px)] items-center py-16">
        <div className="container">
          <Card variant="elevated" className="mx-auto max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold text-navy">{t.auth.resetPassword.invalidLink}</h1>
            <p className="mb-6 text-gray-600">
              {t.auth.resetPassword.invalidLinkMessage}
            </p>
            <Link to="/forgot-password">
              <Button className="w-full">{t.auth.resetPassword.requestNewLink}</Button>
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <section className="flex min-h-[calc(100vh-200px)] items-center py-16">
        <div className="container">
          <Card variant="elevated" className="mx-auto max-w-md text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
            <h1 className="mb-2 text-2xl font-bold text-navy">{t.auth.resetPassword.successTitle}</h1>
            <p className="mb-6 text-gray-600">
              {t.auth.resetPassword.successMessage}
            </p>
            <Link to="/login">
              <Button className="w-full">{t.auth.resetPassword.goToLogin}</Button>
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-200px)] items-center py-16">
      <div className="container">
        <Card variant="elevated" className="mx-auto max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-navy">{t.auth.resetPassword.title}</h1>
            <p className="text-gray-600">{t.auth.resetPassword.subtitle}</p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <Input
              label={t.common.labels.newPassword}
              type="password"
              {...register('password')}
              error={errors.password?.message}
              required
            />
            <Input
              label={t.common.labels.confirmPassword}
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              {t.auth.resetPassword.submit}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
