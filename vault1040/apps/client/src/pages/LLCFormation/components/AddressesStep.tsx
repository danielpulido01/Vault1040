import { useEffect, useState } from 'react';
import { ChevronLeft, MapPin, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { LLCFormationData, Address, FloridaAddress } from '../types';

interface AddressesStepProps {
  formData: LLCFormationData;
  updateFormData: (data: Partial<LLCFormationData>) => void;
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

export function AddressesStep({ formData, updateFormData, onNext, onBack }: AddressesStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.sameAsPrincipal) {
      updateFormData({ mailingAddress: { ...formData.principalOffice } });
    }
  }, [formData.sameAsPrincipal, formData.principalOffice]);

  const updatePrincipal = (field: keyof Address, value: string) => {
    updateFormData({ principalOffice: { ...formData.principalOffice, [field]: value } });
  };

  const updateMailing = (field: keyof Address, value: string) => {
    updateFormData({ mailingAddress: { ...formData.mailingAddress, [field]: value } });
  };

  const updateAgent = (field: 'name' | keyof FloridaAddress, value: string) => {
    if (field === 'name') {
      updateFormData({ registeredAgent: { ...formData.registeredAgent, name: value } });
    } else {
      updateFormData({
        registeredAgent: {
          ...formData.registeredAgent,
          address: { ...formData.registeredAgent.address, [field]: value },
        },
      });
    }
  };

  const validateAddress = (addr: Address, prefix: string) => {
    const errs: Record<string, string> = {};
    if (!addr.street) errs[`${prefix}.street`] = 'Street is required';
    if (!addr.city) errs[`${prefix}.city`] = 'City is required';
    if (!addr.state) errs[`${prefix}.state`] = 'State is required';
    if (!addr.zipCode || !/^\d{5}(-\d{4})?$/.test(addr.zipCode))
      errs[`${prefix}.zipCode`] = 'Enter a valid ZIP code';
    return errs;
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {
      ...validateAddress(formData.principalOffice, 'principal'),
    };

    if (!formData.sameAsPrincipal) {
      Object.assign(newErrors, validateAddress(formData.mailingAddress, 'mailing'));
    }

    if (!formData.registeredAgent.name) {
      newErrors['agent.name'] = 'Registered agent name is required';
    }
    if (!formData.registeredAgent.address.street) {
      newErrors['agent.street'] = 'Street is required';
    }
    if (!formData.registeredAgent.address.city) {
      newErrors['agent.city'] = 'City is required';
    }
    if (
      !formData.registeredAgent.address.zipCode ||
      !/^\d{5}(-\d{4})?$/.test(formData.registeredAgent.address.zipCode)
    ) {
      newErrors['agent.zipCode'] = 'Enter a valid ZIP code';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> Business Information
      </Button>

      <h2 className="mb-2 text-2xl font-bold text-navy">Addresses</h2>
      <p className="mb-6 text-gray-600">
        Provide the principal office address, mailing address, and registered agent for your LLC.
      </p>

      <div className="space-y-6">
        {/* Principal Office */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-navy">Principal Place of Business</h3>
              <p className="text-sm text-gray-500">The main address of your LLC.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Street Address"
                value={formData.principalOffice.street}
                onChange={(e) => updatePrincipal('street', e.target.value)}
                error={errors['principal.street']}
              />
            </div>
            <Input
              label="City"
              value={formData.principalOffice.city}
              onChange={(e) => updatePrincipal('city', e.target.value)}
              error={errors['principal.city']}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">State</label>
                <select
                  className="input"
                  value={formData.principalOffice.state}
                  onChange={(e) => updatePrincipal('state', e.target.value)}
                >
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors['principal.state'] && (
                  <p className="mt-1 text-xs text-red-500">{errors['principal.state']}</p>
                )}
              </div>
              <Input
                label="ZIP Code"
                value={formData.principalOffice.zipCode}
                onChange={(e) => updatePrincipal('zipCode', e.target.value)}
                error={errors['principal.zipCode']}
                maxLength={10}
              />
            </div>
          </div>
        </Card>

        {/* Mailing Address */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-navy">Mailing Address</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.sameAsPrincipal}
                onChange={(e) => updateFormData({ sameAsPrincipal: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Same as principal address
            </label>
          </div>

          {!formData.sameAsPrincipal && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  value={formData.mailingAddress.street}
                  onChange={(e) => updateMailing('street', e.target.value)}
                  error={errors['mailing.street']}
                />
              </div>
              <Input
                label="City"
                value={formData.mailingAddress.city}
                onChange={(e) => updateMailing('city', e.target.value)}
                error={errors['mailing.city']}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">State</label>
                  <select
                    className="input"
                    value={formData.mailingAddress.state}
                    onChange={(e) => updateMailing('state', e.target.value)}
                  >
                    <option value="">Select</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors['mailing.state'] && (
                    <p className="mt-1 text-xs text-red-500">{errors['mailing.state']}</p>
                  )}
                </div>
                <Input
                  label="ZIP Code"
                  value={formData.mailingAddress.zipCode}
                  onChange={(e) => updateMailing('zipCode', e.target.value)}
                  error={errors['mailing.zipCode']}
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
              <h3 className="font-semibold text-navy">Registered Agent</h3>
              <p className="text-sm text-gray-500">
                Must be a Florida resident or registered Florida business with a physical address.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Registered Agent Name"
                value={formData.registeredAgent.name}
                onChange={(e) => updateAgent('name', e.target.value)}
                error={errors['agent.name']}
              />
              <p className="mt-1 text-xs text-gray-500">
                Person or business designated to receive legal notices in Florida.
              </p>
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Street Address"
                value={formData.registeredAgent.address.street}
                onChange={(e) => updateAgent('street', e.target.value)}
                error={errors['agent.street']}
              />
            </div>
            <Input
              label="City"
              value={formData.registeredAgent.address.city}
              onChange={(e) => updateAgent('city', e.target.value)}
              error={errors['agent.city']}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">State</label>
                <input type="text" className="input bg-gray-50" value="FL" disabled />
                <p className="mt-1 text-xs text-gray-500">Florida only</p>
              </div>
              <Input
                label="ZIP Code"
                value={formData.registeredAgent.address.zipCode}
                onChange={(e) => updateAgent('zipCode', e.target.value)}
                error={errors['agent.zipCode']}
                maxLength={10}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={validateAndProceed} size="lg">Continue</Button>
        </div>
      </div>
    </div>
  );
}
