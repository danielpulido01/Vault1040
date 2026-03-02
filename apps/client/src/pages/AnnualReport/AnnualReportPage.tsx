import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import api from '@/lib/api';
import { EntityInfoStep } from './components/EntityInfoStep';
import { AddressesStep } from './components/AddressesStep';
import { OfficersStep } from './components/OfficersStep';
import { ReviewPaymentStep } from './components/ReviewPaymentStep';
import type { AnnualReportFormData, EntityType } from './types';

type Step = 1 | 2 | 3 | 4 | 5;

const initialFormData: AnnualReportFormData = {
  documentNumber: '',
  entityType: 'llc' as EntityType,
  businessName: '',
  fein: '',
  principalOffice: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  },
  sameAsPrincipal: false,
  mailingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  },
  registeredAgent: {
    name: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
    },
  },
  officers: [],
  llcMembers: [],
  lpPartners: [],
  contactEmail: '',
  contactPhone: '',
};

export function AnnualReportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillToken = searchParams.get('token');

  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<AnnualReportFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Pre-fill state
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [prefillTokenId, setPrefillTokenId] = useState<string | null>(null);
  const [prefillError, setPrefillError] = useState<string | null>(null);
  const [isLoadingPrefill, setIsLoadingPrefill] = useState(!!prefillToken);

  // Fetch pre-fill data on mount if token present
  useEffect(() => {
    if (prefillToken) {
      fetchPrefillData(prefillToken);
    }
  }, [prefillToken]);

  const fetchPrefillData = async (token: string) => {
    try {
      const response = await api.get(`/prefill/${token}`);
      const { client, sunbizData, tokenId } = response.data.data;

      // Populate form with pre-filled data
      setFormData({
        ...initialFormData,
        documentNumber: sunbizData.documentNumber,
        entityType: sunbizData.entityType,
        businessName: sunbizData.businessName,
        fein: sunbizData.fein,
        principalOffice: sunbizData.principalOffice,
        mailingAddress: sunbizData.mailingAddress,
        registeredAgent: sunbizData.registeredAgent,
        officers: sunbizData.officers || [],
        llcMembers: sunbizData.llcMembers || [],
        lpPartners: sunbizData.lpPartners || [],
        contactEmail: client.contactEmail,
        contactPhone: client.contactPhone || '',
      });

      setIsPrefilled(true);
      setPrefillTokenId(tokenId);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } | string } } };
      const errorData = err.response?.data?.error;
      const errorMessage = typeof errorData === 'string'
        ? errorData
        : errorData?.message || 'This link is invalid or has expired.';
      setPrefillError(errorMessage);
    } finally {
      setIsLoadingPrefill(false);
    }
  };

  const updateFormData = (data: Partial<AnnualReportFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async (paymentIntentId: string) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/annual-reports', {
        documentNumber: formData.documentNumber,
        entityType: formData.entityType,
        businessName: formData.businessName,
        fein: formData.fein,
        principalOffice: formData.principalOffice,
        mailingAddress: formData.sameAsPrincipal
          ? formData.principalOffice
          : formData.mailingAddress,
        registeredAgent: formData.registeredAgent,
        officers: formData.officers,
        llcMembers: formData.llcMembers,
        lpPartners: formData.lpPartners,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        prefillTokenId,
        paymentIntentId,
      });
      setReferenceNumber(response.data.data.referenceNumber);
      setStep(5);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (targetStep: Step) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  const steps = [
    { num: 1, label: t.annualReport.steps.entityInfo },
    { num: 2, label: t.annualReport.steps.addresses },
    { num: 3, label: t.annualReport.steps.officers },
    { num: 4, label: t.annualReport.steps.review },
  ];

  // Show loading state while fetching pre-fill data
  if (isLoadingPrefill) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  // Show error if pre-fill token is invalid
  if (prefillError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card variant="elevated" className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-xl font-bold text-navy">Link Unavailable</h2>
          <p className="mb-6 text-gray-600">{prefillError}</p>
          <Button onClick={() => navigate('/annual-report')}>
            Start New Filing
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-12 md:py-16">
        <div className="container text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {t.annualReport.pageTitle}
          </h1>
          <p className="text-lg text-gray-300">{t.annualReport.pageSubtitle}</p>
        </div>
      </section>

      {/* Steps Indicator */}
      {step < 5 && (
        <section className="border-b bg-white py-6">
          <div className="container">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {steps.map((s) => (
                <button
                  key={s.num}
                  onClick={() => goToStep(s.num as Step)}
                  disabled={s.num >= step}
                  className="flex items-center gap-2 md:gap-4"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      step >= s.num
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    } ${s.num < step ? 'cursor-pointer hover:bg-primary-dark' : ''}`}
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
            {/* Pre-filled Banner */}
            {isPrefilled && step < 5 && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Your annual report has been pre-filled
                    </p>
                    <p className="text-sm text-green-600">
                      Please review all information and make any necessary updates before
                      submitting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Entity Information */}
            {step === 1 && (
              <EntityInfoStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}

            {/* Step 2: Addresses */}
            {step === 2 && (
              <AddressesStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {/* Step 3: Officers/Members/Partners */}
            {step === 3 && (
              <OfficersStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {/* Step 4: Review & Payment */}
            {step === 4 && (
              <ReviewPaymentStep
                formData={formData}
                updateFormData={updateFormData}
                onSubmit={handleSubmit}
                onBack={handleBack}
                onEditStep={goToStep}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <Card variant="elevated" className="text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
                <h2 className="mb-2 text-2xl font-bold text-navy">
                  {t.annualReport.confirmation.title}
                </h2>
                <p className="mb-6 text-gray-600">
                  {t.annualReport.confirmation.subtitle}
                </p>

                {/* Payment Success Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  Payment Successful
                </div>

                <div className="mb-6 rounded-lg bg-gray-50 p-6">
                  <p className="mb-2 text-sm text-gray-500">
                    {t.annualReport.confirmation.referenceNumber}
                  </p>
                  <p className="text-2xl font-bold text-navy">{referenceNumber}</p>
                </div>

                <div className="mb-6 rounded-lg bg-primary/5 p-6 text-left">
                  <h3 className="mb-2 font-semibold text-navy">
                    {t.annualReport.confirmation.nextSteps}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your payment has been received and your annual report filing is now being processed.
                    Our team will file your report with the Florida Division of Corporations and you'll
                    receive email updates at each step.
                  </p>
                </div>

                <p className="mb-8 text-sm text-gray-500">
                  {t.annualReport.confirmation.emailSent}{' '}
                  <strong>{formData.contactEmail}</strong>
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button onClick={() => navigate('/')}>
                    {t.common.buttons.returnHome}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
