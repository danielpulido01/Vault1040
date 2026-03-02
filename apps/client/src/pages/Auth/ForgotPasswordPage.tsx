import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { useTranslation } from '@/i18n';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordSchema = z.object({
    email: z.string().email(t.common.validation.invalidEmail),
  });

  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await api.post('/auth/forgot-password', data);
      setIsSubmitted(true);
    } catch {
      // Still show success to not reveal if email exists
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <section className="flex min-h-[calc(100vh-200px)] items-center py-16">
        <div className="container">
          <Card variant="elevated" className="mx-auto max-w-md text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
            <h1 className="mb-2 text-2xl font-bold text-navy">{t.auth.forgotPassword.successTitle}</h1>
            <p className="mb-6 text-gray-600">
              {t.auth.forgotPassword.successMessage}
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                {t.auth.forgotPassword.backToLogin}
              </Button>
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
              <Mail className="h-7 w-7 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-navy">{t.auth.forgotPassword.title}</h1>
            <p className="text-gray-600">
              {t.auth.forgotPassword.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <Input
              label={t.common.labels.email}
              type="email"
              {...register('email')}
              error={errors.email?.message}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              {t.auth.forgotPassword.submit}
            </Button>
          </form>

          <Link
            to="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.auth.forgotPassword.backToLogin}
          </Link>
        </Card>
      </div>
    </section>
  );
}
