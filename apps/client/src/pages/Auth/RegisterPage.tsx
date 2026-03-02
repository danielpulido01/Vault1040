import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { useTranslation } from '@/i18n';

export function RegisterPage() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const registerSchema = z.object({
    firstName: z.string().min(1, t.common.validation.required),
    lastName: z.string().min(1, t.common.validation.required),
    email: z.string().email(t.common.validation.invalidEmail),
    phone: z.string().optional(),
    password: z.string().min(8, t.common.validation.passwordMin),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.common.validation.passwordMismatch,
    path: ['confirmPassword'],
  });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    try {
      await api.post('/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || t.auth.register.error);
    }
  };

  if (isSuccess) {
    return (
      <section className="flex min-h-[calc(100vh-200px)] items-center py-16">
        <div className="container">
          <Card variant="elevated" className="mx-auto max-w-md text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
            <h1 className="mb-2 text-2xl font-bold text-navy">
              {t.auth.register.successTitle}
            </h1>
            <p className="mb-6 text-gray-600">
              {t.auth.register.successMessage}
            </p>
            <Link to="/login">
              <Button className="w-full">{t.auth.register.goToLogin}</Button>
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
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-navy">{t.auth.register.title}</h1>
            <p className="text-gray-600">{t.auth.register.subtitle}</p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label={t.common.labels.firstName}
                {...register('firstName')}
                error={errors.firstName?.message}
                required
              />
              <Input
                label={t.common.labels.lastName}
                {...register('lastName')}
                error={errors.lastName?.message}
                required
              />
            </div>
            <Input
              label={t.common.labels.email}
              type="email"
              {...register('email')}
              error={errors.email?.message}
              required
            />
            <Input
              label={t.common.labels.phoneOptional}
              type="tel"
              {...register('phone')}
            />
            <Input
              label={t.common.labels.password}
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
              {t.auth.register.submit}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t.auth.register.hasAccount}{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              {t.auth.register.signIn}
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
}
