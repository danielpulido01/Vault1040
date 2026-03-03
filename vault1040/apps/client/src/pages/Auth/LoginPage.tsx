import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/features/auth/store/authStore';
import api from '@/lib/api';
import { useTranslation } from '@/i18n';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');

  const loginSchema = z.object({
    email: z.string().email(t.common.validation.invalidEmail),
    password: z.string().min(1, t.common.validation.required),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const response = await api.post('/auth/login', data);
      setAuth(response.data.data.user, response.data.data.accessToken);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || t.auth.login.error);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-200px)] items-center py-16">
      <div className="container">
        <Card variant="elevated" className="mx-auto max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
              <LogIn className="h-7 w-7 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-navy">{t.auth.login.title}</h1>
            <p className="text-gray-600">{t.auth.login.subtitle}</p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <Input
              label={t.common.labels.email}
              type="email"
              {...register('email')}
              error={errors.email?.message}
              required
            />
            <Input
              label={t.common.labels.password}
              type="password"
              {...register('password')}
              error={errors.password?.message}
              required
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t.auth.login.forgotPassword}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              {t.auth.login.submit}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t.auth.login.noAccount}{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              {t.auth.login.createAccount}
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
}
