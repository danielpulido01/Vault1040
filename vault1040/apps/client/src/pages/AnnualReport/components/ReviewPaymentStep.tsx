import { useState, useEffect } from 'react';
import { ChevronLeft, Edit2, Building2, MapPin, Users, Mail, Phone, Loader2, CheckCircle } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import { stripePromise } from '@/lib/stripe';
import api from '@/lib/api';
import { PricingSummary } from './PricingSummary';
import { PaymentForm } from './PaymentForm';
import type { AnnualReportFormData } from '../types';

interface ReviewPaymentStepProps {
  formData: AnnualReportFormData;
  updateFormData: (data: Partial<AnnualReportFormData>) => void;
  onSubmit: (paymentIntentId: string) => void;
  onBack: () => void;
  onEditStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  isSubmitting: boolean;
  paymentConfirmed?: boolean;
  externalPaymentMethod?: string | null;
}

interface PaymentIntentData {
  clientSecret: string;
  paymentIntentId: string;
  fees: {
    stateFee: number;
    serviceFee: number;
    lateFee: number;
    totalFee: number;
  };
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  check: 'Check',
  subscription: 'Subscription Bundle',
  wire: 'Wire Transfer',
  ach: 'ACH Transfer',
  other: 'Other',
};

export function ReviewPaymentStep({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  onEditStep,
  isSubmitting,
  paymentConfirmed = false,
  externalPaymentMethod,
}: ReviewPaymentStepProps) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentData | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const isCorporation =
    formData.entityType === 'profit-corp' || formData.entityType === 'non-profit-corp';
  const isLLC = formData.entityType === 'llc';
  const isLP = formData.entityType === 'lp' || formData.entityType === 'lllp';

  // Create PaymentIntent when step loads (only if payment not pre-confirmed)
  useEffect(() => {
    if (!paymentConfirmed) {
      createPaymentIntent();
    } else {
      setIsLoadingPayment(false);
    }
  }, [paymentConfirmed]);

  const createPaymentIntent = async () => {
    setIsLoadingPayment(true);
    setPaymentError(null);

    try {
      const response = await api.post('/payments/create-payment-intent', {
        entityType: formData.entityType,
        businessName: formData.businessName,
        documentNumber: formData.documentNumber,
        contactEmail: formData.contactEmail,
      });

      setPaymentIntent(response.data.data);
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      setPaymentError('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const formatAddress = (address: { street: string; city: string; state?: string; zipCode: string }) => {
    return `${address.street}, ${address.city}${address.state ? `, ${address.state}` : ', FL'} ${address.zipCode}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactEmail) {
      newErrors.contactEmail = t.annualReport.validation.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = t.annualReport.validation.emailInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    if (validateForm()) {
      onSubmit(paymentIntentId);
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  // Handle direct submission when payment is pre-confirmed
  const handleDirectSubmit = () => {
    if (validateForm()) {
      // Pass empty string for paymentIntentId since payment was external
      onSubmit('');
    }
  };

  // Re-create payment intent if contact email changes (for receipt)
  const handleEmailBlur = () => {
    if (formData.contactEmail && paymentIntent) {
      createPaymentIntent();
    }
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> {t.annualReport.steps.officers}
      </Button>

      <h2 className="mb-2 text-2xl font-bold text-navy">
        {t.annualReport.reviewStep.title}
      </h2>
      <p className="mb-6 text-gray-600">{t.annualReport.reviewStep.subtitle}</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Summary */}
        <div className="space-y-6 lg:col-span-2">
          {/* Entity Information */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-navy">
                  {t.annualReport.reviewStep.entitySection}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(1)}
                className="text-primary"
              >
                <Edit2 className="mr-1 h-4 w-4" />
                {t.annualReport.reviewStep.edit}
              </Button>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">
                  {t.annualReport.entityInfoStep.documentNumber}
                </dt>
                <dd className="font-medium text-navy">{formData.documentNumber}</dd>
              </div>
              <div>
                <dt className="text-gray-500">
                  {t.annualReport.entityInfoStep.entityType}
                </dt>
                <dd className="font-medium text-navy">
                  {t.annualReport.entityInfoStep.entityTypes[formData.entityType]}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">
                  {t.annualReport.entityInfoStep.businessName}
                </dt>
                <dd className="font-medium text-navy">{formData.businessName}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t.annualReport.entityInfoStep.fein}</dt>
                <dd className="font-medium text-navy">{formData.fein}</dd>
              </div>
            </dl>
          </Card>

          {/* Addresses */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-navy">
                  {t.annualReport.reviewStep.addressSection}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(2)}
                className="text-primary"
              >
                <Edit2 className="mr-1 h-4 w-4" />
                {t.annualReport.reviewStep.edit}
              </Button>
            </div>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">
                  {t.annualReport.addressesStep.principalOffice.title}
                </dt>
                <dd className="font-medium text-navy">
                  {formatAddress(formData.principalOffice)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">
                  {t.annualReport.addressesStep.mailingAddress.title}
                </dt>
                <dd className="font-medium text-navy">
                  {formData.sameAsPrincipal
                    ? `Same as principal office`
                    : formatAddress(formData.mailingAddress)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">
                  {t.annualReport.addressesStep.registeredAgent.title}
                </dt>
                <dd className="font-medium text-navy">
                  {formData.registeredAgent.name}
                  <br />
                  <span className="text-gray-600">
                    {formatAddress(formData.registeredAgent.address)}
                  </span>
                </dd>
              </div>
            </dl>
          </Card>

          {/* Officers/Members/Partners */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-navy">
                  {t.annualReport.reviewStep.officersSection}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(3)}
                className="text-primary"
              >
                <Edit2 className="mr-1 h-4 w-4" />
                {t.annualReport.reviewStep.edit}
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              {isCorporation &&
                formData.officers.map((officer) => (
                  <div key={officer.id} className="rounded-lg bg-gray-50 p-3">
                    <div className="font-medium text-navy">
                      {t.annualReport.officersStep.corporation.titles[officer.title]} -{' '}
                      {officer.name}
                    </div>
                    <div className="text-gray-500">
                      {formatAddress(officer.address)}
                    </div>
                  </div>
                ))}

              {isLLC &&
                formData.llcMembers.map((member) => (
                  <div key={member.id} className="rounded-lg bg-gray-50 p-3">
                    <div className="font-medium text-navy">
                      {t.annualReport.officersStep.llc.types[member.type]} - {member.name}
                    </div>
                    <div className="text-gray-500">
                      {formatAddress(member.address)}
                    </div>
                  </div>
                ))}

              {isLP &&
                formData.lpPartners.map((partner) => (
                  <div key={partner.id} className="rounded-lg bg-gray-50 p-3">
                    <div className="font-medium text-navy">
                      {t.annualReport.officersStep.lp.types[partner.type]} - {partner.name}
                    </div>
                    <div className="text-gray-500">
                      {formatAddress(partner.address)}
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Contact Information */}
          <Card variant="bordered">
            <h3 className="mb-4 font-semibold text-navy">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t.common.labels.email}
                type="email"
                value={formData.contactEmail}
                onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                onBlur={handleEmailBlur}
                error={errors.contactEmail}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
              <Input
                label={t.common.labels.phoneOptional}
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>
          </Card>
        </div>

        {/* Right Column - Pricing & Payment */}
        <div className="space-y-6">
          <PricingSummary entityType={formData.entityType} />

          {/* Payment Section */}
          <Card variant="bordered">
            <h3 className="mb-4 font-semibold text-navy">Payment</h3>

            {paymentConfirmed ? (
              /* Pre-confirmed external payment */
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Payment Already Received</p>
                      <p className="text-sm text-green-600">
                        {externalPaymentMethod
                          ? `Paid via ${PAYMENT_METHOD_LABELS[externalPaymentMethod] || externalPaymentMethod}`
                          : 'Your payment has been confirmed'}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleDirectSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Annual Report'
                  )}
                </Button>
              </div>
            ) : isLoadingPayment ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : paymentError && !paymentIntent ? (
              <div className="space-y-4">
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                  {paymentError}
                </div>
                <Button onClick={createPaymentIntent} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
            ) : paymentIntent ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: paymentIntent.clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#0891b2',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    },
                  },
                }}
              >
                <PaymentForm
                  clientSecret={paymentIntent.clientSecret}
                  totalAmount={paymentIntent.fees.totalFee}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isSubmitting={isSubmitting}
                />
              </Elements>
            ) : null}
          </Card>

          <p className="text-center text-xs text-gray-500">
            {t.annualReport.reviewStep.termsNotice}
          </p>
        </div>
      </div>
    </div>
  );
}
