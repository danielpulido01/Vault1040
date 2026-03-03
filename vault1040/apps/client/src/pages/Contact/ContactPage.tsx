import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { useTranslation } from '@/i18n';

export function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactSchema = z.object({
    firstName: z.string().min(1, t.common.validation.required),
    lastName: z.string().min(1, t.common.validation.required),
    email: z.string().email(t.common.validation.invalidEmail),
    phone: z.string().optional(),
    subject: z.string().min(1, t.common.validation.required),
    message: z.string().min(10, t.contact.form.messageMinLength),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await api.post('/contacts', data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {t.contact.pageTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            {t.contact.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-navy">
                {t.contact.form.title}
              </h2>

              {isSubmitted ? (
                <Card variant="bordered" className="text-center">
                  <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold text-navy">
                    {t.contact.form.successTitle}
                  </h3>
                  <p className="text-gray-600">
                    {t.contact.form.successMessage}
                  </p>
                </Card>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                      label={t.common.labels.email}
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      required
                    />
                    <Input
                      label={t.contact.form.phoneOptional}
                      type="tel"
                      {...register('phone')}
                    />
                  </div>
                  <Input
                    label={t.contact.form.subject}
                    {...register('subject')}
                    error={errors.subject?.message}
                    required
                  />
                  <div>
                    <label className="label">
                      {t.contact.form.message}<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      className={`input resize-none ${errors.message ? 'input-error' : ''}`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="h-5 w-5" />}
                  >
                    {t.contact.form.submit}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-navy">
                {t.contact.info.title}
              </h2>
              <p className="mb-8 text-gray-600">
                {t.contact.info.description}
              </p>

              <div className="space-y-6">
                <Card variant="bordered" className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{t.contact.info.address}</h3>
                    <p className="text-gray-600">
                      1414 NW 107TH Ave Suite 100<br />
                      Miami FL 33172
                    </p>
                  </div>
                </Card>

                <Card variant="bordered" className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{t.contact.info.phone}</h3>
                    <a
                      href="tel:+13055551040"
                      className="text-gray-600 hover:text-primary"
                    >
                      (305) 555-1040
                    </a>
                  </div>
                </Card>

                <Card variant="bordered" className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{t.contact.info.email}</h3>
                    <a
                      href="mailto:info@vault1040.com"
                      className="text-gray-600 hover:text-primary"
                    >
                      info@vault1040.com
                    </a>
                  </div>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 font-semibold text-navy">{t.contact.info.hours}</h3>
                <div className="space-y-2 text-gray-600">
                  <p>{t.contact.info.weekdays}</p>
                  <p>{t.contact.info.saturday}</p>
                  <p>{t.contact.info.sunday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
