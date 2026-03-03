import { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import type { AnnualReportFormData, Address, FloridaAddress } from '../types';

interface AddressesStepProps {
  formData: AnnualReportFormData;
  updateFormData: (data: Partial<AnnualReportFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export function AddressesStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: AddressesStepProps) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Copy principal to mailing when checkbox is checked
  useEffect(() => {
    if (formData.sameAsPrincipal) {
      updateFormData({
        mailingAddress: { ...formData.principalOffice },
      });
    }
  }, [formData.sameAsPrincipal, formData.principalOffice]);

  const updatePrincipalOffice = (field: keyof Address, value: string) => {
    updateFormData({
      principalOffice: { ...formData.principalOffice, [field]: value },
    });
  };

  const updateMailingAddress = (field: keyof Address, value: string) => {
    updateFormData({
      mailingAddress: { ...formData.mailingAddress, [field]: value },
    });
  };

  const updateRegisteredAgent = (
    field: 'name' | keyof FloridaAddress,
    value: string
  ) => {
    if (field === 'name') {
      updateFormData({
        registeredAgent: { ...formData.registeredAgent, name: value },
      });
    } else {
      updateFormData({
        registeredAgent: {
          ...formData.registeredAgent,
          address: { ...formData.registeredAgent.address, [field]: value },
        },
      });
    }
  };

  const validateAddress = (
    address: Address,
    prefix: string
  ): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!address.street) errs[`${prefix}.street`] = t.annualReport.validation.streetRequired;
    if (!address.city) errs[`${prefix}.city`] = t.annualReport.validation.cityRequired;
    if (!address.state) errs[`${prefix}.state`] = t.annualReport.validation.stateRequired;
    if (!address.zipCode || !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      errs[`${prefix}.zipCode`] = t.annualReport.validation.zipCodeInvalid;
    }
    return errs;
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    // Validate principal office
    Object.assign(newErrors, validateAddress(formData.principalOffice, 'principalOffice'));

    // Validate mailing address if not same as principal
    if (!formData.sameAsPrincipal) {
      Object.assign(newErrors, validateAddress(formData.mailingAddress, 'mailingAddress'));
    }

    // Validate registered agent
    if (!formData.registeredAgent.name) {
      newErrors['registeredAgent.name'] = t.annualReport.validation.registeredAgentRequired;
    }
    if (!formData.registeredAgent.address.street) {
      newErrors['registeredAgent.street'] = t.annualReport.validation.streetRequired;
    }
    if (!formData.registeredAgent.address.city) {
      newErrors['registeredAgent.city'] = t.annualReport.validation.cityRequired;
    }
    if (
      !formData.registeredAgent.address.zipCode ||
      !/^\d{5}(-\d{4})?$/.test(formData.registeredAgent.address.zipCode)
    ) {
      newErrors['registeredAgent.zipCode'] = t.annualReport.validation.zipCodeInvalid;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> {t.annualReport.steps.entityInfo}
      </Button>

      <h2 className="mb-2 text-2xl font-bold text-navy">
        {t.annualReport.addressesStep.title}
      </h2>
      <p className="mb-6 text-gray-600">{t.annualReport.addressesStep.subtitle}</p>

      <div className="space-y-6">
        {/* Principal Office */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-navy">
                {t.annualReport.addressesStep.principalOffice.title}
              </h3>
              <p className="text-sm text-gray-500">
                {t.annualReport.addressesStep.principalOffice.description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label={t.annualReport.addressesStep.fields.street}
                value={formData.principalOffice.street}
                onChange={(e) => updatePrincipalOffice('street', e.target.value)}
                error={errors['principalOffice.street']}
              />
            </div>
            <Input
              label={t.annualReport.addressesStep.fields.city}
              value={formData.principalOffice.city}
              onChange={(e) => updatePrincipalOffice('city', e.target.value)}
              error={errors['principalOffice.city']}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{t.annualReport.addressesStep.fields.state}</label>
                <select
                  className="input"
                  value={formData.principalOffice.state}
                  onChange={(e) => updatePrincipalOffice('state', e.target.value)}
                >
                  <option value="">Select</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors['principalOffice.state'] && (
                  <p className="mt-1 text-xs text-red-500">{errors['principalOffice.state']}</p>
                )}
              </div>
              <Input
                label={t.annualReport.addressesStep.fields.zipCode}
                value={formData.principalOffice.zipCode}
                onChange={(e) => updatePrincipalOffice('zipCode', e.target.value)}
                error={errors['principalOffice.zipCode']}
                maxLength={10}
              />
            </div>
          </div>
        </Card>

        {/* Mailing Address */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-navy">
              {t.annualReport.addressesStep.mailingAddress.title}
            </h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.sameAsPrincipal}
                onChange={(e) => updateFormData({ sameAsPrincipal: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              {t.annualReport.addressesStep.mailingAddress.sameAsPrincipal}
            </label>
          </div>

          {!formData.sameAsPrincipal && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label={t.annualReport.addressesStep.fields.street}
                  value={formData.mailingAddress.street}
                  onChange={(e) => updateMailingAddress('street', e.target.value)}
                  error={errors['mailingAddress.street']}
                />
              </div>
              <Input
                label={t.annualReport.addressesStep.fields.city}
                value={formData.mailingAddress.city}
                onChange={(e) => updateMailingAddress('city', e.target.value)}
                error={errors['mailingAddress.city']}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">{t.annualReport.addressesStep.fields.state}</label>
                  <select
                    className="input"
                    value={formData.mailingAddress.state}
                    onChange={(e) => updateMailingAddress('state', e.target.value)}
                  >
                    <option value="">Select</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors['mailingAddress.state'] && (
                    <p className="mt-1 text-xs text-red-500">{errors['mailingAddress.state']}</p>
                  )}
                </div>
                <Input
                  label={t.annualReport.addressesStep.fields.zipCode}
                  value={formData.mailingAddress.zipCode}
                  onChange={(e) => updateMailingAddress('zipCode', e.target.value)}
                  error={errors['mailingAddress.zipCode']}
                  maxLength={10}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Registered Agent */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-navy">
                {t.annualReport.addressesStep.registeredAgent.title}
              </h3>
              <p className="text-sm text-gray-500">
                {t.annualReport.addressesStep.registeredAgent.description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label={t.annualReport.addressesStep.registeredAgent.name}
                value={formData.registeredAgent.name}
                onChange={(e) => updateRegisteredAgent('name', e.target.value)}
                error={errors['registeredAgent.name']}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t.annualReport.addressesStep.registeredAgent.nameHint}
              </p>
            </div>
            <div className="sm:col-span-2">
              <Input
                label={t.annualReport.addressesStep.fields.street}
                value={formData.registeredAgent.address.street}
                onChange={(e) => updateRegisteredAgent('street', e.target.value)}
                error={errors['registeredAgent.street']}
              />
            </div>
            <Input
              label={t.annualReport.addressesStep.fields.city}
              value={formData.registeredAgent.address.city}
              onChange={(e) => updateRegisteredAgent('city', e.target.value)}
              error={errors['registeredAgent.city']}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{t.annualReport.addressesStep.fields.state}</label>
                <input
                  type="text"
                  className="input bg-gray-50"
                  value="FL"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Florida only</p>
              </div>
              <Input
                label={t.annualReport.addressesStep.fields.zipCode}
                value={formData.registeredAgent.address.zipCode}
                onChange={(e) => updateRegisteredAgent('zipCode', e.target.value)}
                error={errors['registeredAgent.zipCode']}
                maxLength={10}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            {t.common.buttons.back}
          </Button>
          <Button onClick={validateAndProceed} size="lg">
            {t.common.buttons.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
