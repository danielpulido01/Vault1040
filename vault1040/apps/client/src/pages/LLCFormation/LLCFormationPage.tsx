import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { BusinessInfoStep } from './components/BusinessInfoStep';
import { AddressesStep } from './components/AddressesStep';
import { ManagementStep } from './components/ManagementStep';
import { ReviewPaymentStep } from './components/ReviewPaymentStep';
import type { LLCFormationData } from './types';

type Step = 1 | 2 | 3 | 4 | 5;

const initialFormData: LLCFormationData = {
  llcName: '',
  fein: '',
  effectiveDate: '',
  principalOffice: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
  sameAsPrincipal: true,
  mailingAddress: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
  registeredAgent: { name: '', address: { street: '', city: '', zipCode: '' } },
  managementType: 'MEMBER_MANAGED',
  membersManagers: [],
  contactEmail: '',
  contactPhone: '',
};

const STEPS = [
  { num: 1, label: 'Business Info' },
  { num: 2, label: 'Addresses' },
  { num: 3, label: 'Management' },
  { num: 4, label: 'Review & Pay' },
];

export function LLCFormationPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<LLCFormationData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateFormData = (data: Partial<LLCFormationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  const handleBack = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  const goToStep = (target: Step) => {
    if (target < step) setStep(target);
  };

  const handleSubmit = async (paymentIntentId: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await api.post('/llc-formations', {
        llcName: formData.llcName,
        fein: formData.fein || undefined,
        effectiveDate: formData.effectiveDate || undefined,
        principalOffice: formData.principalOffice,
        sameAsPrincipal: formData.sameAsPrincipal,
        mailingAddress: formData.sameAsPrincipal ? null : formData.mailingAddress,
        registeredAgent: formData.registeredAgent,
        managementType: formData.managementType,
        membersManagers: formData.membersManagers,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || undefined,
        paymentIntentId,
      });
      setReferenceNumber(response.data.data.referenceNumber);
      setStep(5);
    } catch (error) {
      setSubmitError('Submission failed. Please try again or contact support.');
      console.error('LLC formation submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-12 md:py-16">
        <div className="container text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Florida LLC Formation
          </h1>
          <p className="text-lg text-gray-300">
            Start your Florida LLC today — we handle the paperwork with the Division of Corporations.
          </p>
        </div>
      </section>

      {/* Steps Indicator */}
      {step < 5 && (
        <section className="border-b bg-white py-6">
          <div className="container">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {STEPS.map((s) => (
                <button
                  key={s.num}
                  onClick={() => goToStep(s.num as Step)}
                  disabled={s.num >= step}
                  className="flex items-center gap-2 md:gap-4"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      step >= s.num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    } ${s.num < step ? 'cursor-pointer hover:bg-primary/80' : ''}`}
                  >
                    {step > s.num ? <CheckCircle className="h-5 w-5" /> : s.num}
                  </div>
                  <span className="hidden text-sm font-medium text-gray-600 md:block">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form Content */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {submitError && step !== 5 && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {step === 1 && (
              <BusinessInfoStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}

            {step === 2 && (
              <AddressesStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {step === 3 && (
              <ManagementStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {step === 4 && (
              <ReviewPaymentStep
                formData={formData}
                onSubmit={handleSubmit}
                onBack={handleBack}
                onEditStep={goToStep}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 5 && (
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-3 text-3xl font-bold text-navy">Order Received!</h2>
                <p className="mb-2 text-lg text-gray-600">
                  Your Florida LLC formation has been submitted.
                </p>
                <p className="mb-8 text-gray-500">
                  Reference: <span className="font-semibold text-navy">{referenceNumber}</span>
                </p>

                <Card variant="bordered" className="mx-auto max-w-md text-left">
                  <h3 className="mb-4 font-semibold text-navy">What Happens Next</h3>
                  <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        1
                      </span>
                      <span>We review your information for accuracy.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        2
                      </span>
                      <span>
                        We file your Articles of Organization with the Florida Division of Corporations.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        3
                      </span>
                      <span>
                        You receive confirmation by email once the LLC is approved (typically 3–5 business
                        days).
                      </span>
                    </li>
                  </ol>
                </Card>

                <div className="mt-8 flex justify-center gap-4">
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Back to Home
                  </Button>
                  <Button onClick={() => window.location.href = '/contact'}>
                    Contact Us
                  </Button>
                </div>
              </div>
            )}

            {isSubmitting && step === 4 && (
              <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="font-medium text-navy">Submitting your LLC formation...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
