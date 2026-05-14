import { useState, useEffect } from 'react';
import { ChevronLeft, Edit2, Building2, MapPin, Users, Loader2 } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { stripePromise } from '@/lib/stripe';
import api from '@/lib/api';
import { PaymentForm } from '../../AnnualReport/components/PaymentForm';
import type { LLCFormationData } from '../types';
import { STATE_FEE, SERVICE_FEE, TOTAL_FEE } from '../types';

interface ReviewPaymentStepProps {
  formData: LLCFormationData;
  onSubmit: (paymentIntentId: string) => void;
  onBack: () => void;
  onEditStep: (step: 1 | 2 | 3 | 4) => void;
  isSubmitting: boolean;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const formatAddress = (addr: { street: string; city: string; state?: string; zipCode: string }) =>
  `${addr.street}, ${addr.city}${addr.state ? `, ${addr.state}` : ', FL'} ${addr.zipCode}`;

export function ReviewPaymentStep({
  formData,
  onSubmit,
  onBack,
  onEditStep,
  isSubmitting,
}: ReviewPaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    setIsLoadingPayment(true);
    setPaymentError(null);
    try {
      const response = await api.post('/payments/create-llc-payment-intent', {
        llcName: formData.llcName,
        contactEmail: formData.contactEmail,
      });
      setClientSecret(response.data.data.clientSecret);
      setPaymentIntentId(response.data.data.paymentIntentId);
    } catch {
      setPaymentError('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> Management Structure
      </Button>

      <h2 className="mb-2 text-2xl font-bold text-navy">Review & Payment</h2>
      <p className="mb-6 text-gray-600">Review your LLC formation details and complete payment.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary */}
        <div className="space-y-6 lg:col-span-2">
          {/* Business Info */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-navy">Business Information</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEditStep(1)} className="text-primary">
                <Edit2 className="mr-1 h-4 w-4" /> Edit
              </Button>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">LLC Name</dt>
                <dd className="font-medium text-navy">{formData.llcName}</dd>
              </div>
              {formData.fein && (
                <div>
                  <dt className="text-gray-500">FEI/EIN</dt>
                  <dd className="font-medium text-navy">{formData.fein}</dd>
                </div>
              )}
              {formData.effectiveDate && (
                <div>
                  <dt className="text-gray-500">Effective Date</dt>
                  <dd className="font-medium text-navy">{formData.effectiveDate}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Contact Email</dt>
                <dd className="font-medium text-navy">{formData.contactEmail}</dd>
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
                <h3 className="font-semibold text-navy">Addresses</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEditStep(2)} className="text-primary">
                <Edit2 className="mr-1 h-4 w-4" /> Edit
              </Button>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Principal Office</dt>
                <dd className="font-medium text-navy">{formatAddress(formData.principalOffice)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Mailing Address</dt>
                <dd className="font-medium text-navy">
                  {formData.sameAsPrincipal
                    ? 'Same as principal office'
                    : formatAddress(formData.mailingAddress)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Registered Agent</dt>
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

          {/* Management */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-navy">Management</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEditStep(3)} className="text-primary">
                <Edit2 className="mr-1 h-4 w-4" /> Edit
              </Button>
            </div>
            <p className="mb-3 text-sm text-gray-600">
              {formData.managementType === 'MEMBER_MANAGED' ? 'Member-Managed' : 'Manager-Managed'}
            </p>
            <div className="space-y-2">
              {formData.membersManagers.map((p) => (
                <div key={p.id} className="rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="font-medium text-navy capitalize">
                    {p.role} — {p.name}
                  </div>
                  <div className="text-gray-500">{formatAddress(p.address)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pricing & Payment */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card variant="bordered" className="bg-gray-50">
            <h3 className="mb-4 font-semibold text-navy">Fee Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">State Filing Fee</span>
                <span className="font-medium text-navy">{formatCurrency(STATE_FEE)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium text-navy">{formatCurrency(SERVICE_FEE)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-navy">Total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(TOTAL_FEE)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card variant="bordered">
            <h3 className="mb-4 font-semibold text-navy">Payment</h3>

            {isLoadingPayment ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : paymentError && !clientSecret ? (
              <div className="space-y-4">
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">{paymentError}</div>
                <Button onClick={createPaymentIntent} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
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
                  clientSecret={clientSecret}
                  totalAmount={TOTAL_FEE}
                  onPaymentSuccess={onSubmit}
                  onPaymentError={setPaymentError}
                  isSubmitting={isSubmitting}
                />
              </Elements>
            ) : null}
          </Card>

          <p className="text-center text-xs text-gray-500">
            Payment is processed securely by Stripe. We will file your Articles of Organization
            with the Florida Division of Corporations upon receipt.
          </p>
        </div>
      </div>
    </div>
  );
}
