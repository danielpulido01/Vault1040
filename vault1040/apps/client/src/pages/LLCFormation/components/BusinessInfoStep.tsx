import { useState } from 'react';
import { Building2, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { LLCFormationData } from '../types';

interface BusinessInfoStepProps {
  formData: LLCFormationData;
  updateFormData: (data: Partial<LLCFormationData>) => void;
  onNext: () => void;
}

export function BusinessInfoStep({ formData, updateFormData, onNext }: BusinessInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const LLC_SUFFIXES = ['LLC', 'L.L.C.', 'Limited Liability Company', 'Ltd. Liability Co.'];
  const hasValidSuffix = LLC_SUFFIXES.some((s) =>
    formData.llcName.toUpperCase().includes(s.toUpperCase())
  );

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.llcName.trim()) {
      newErrors.llcName = 'LLC name is required';
    } else if (!hasValidSuffix) {
      newErrors.llcName = 'Name must include LLC, L.L.C., or Limited Liability Company';
    }

    if (formData.effectiveDate) {
      const date = new Date(formData.effectiveDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 90);
      if (date < today) {
        newErrors.effectiveDate = 'Effective date cannot be in the past';
      } else if (date > maxDate) {
        newErrors.effectiveDate = 'Effective date cannot be more than 90 days in the future';
      }
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Enter a valid email address';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-navy">Business Information</h2>
      <p className="mb-6 text-gray-600">
        Enter the basic information for your Florida LLC.
      </p>

      <div className="space-y-6">
        <Card variant="bordered">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-navy">LLC Details</h3>
              <p className="text-sm text-gray-500">
                Your LLC name must include a required designator.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                label="LLC Name"
                value={formData.llcName}
                onChange={(e) => updateFormData({ llcName: e.target.value })}
                error={errors.llcName}
                placeholder="e.g. Acme Holdings, LLC"
                required
              />
              {formData.llcName && hasValidSuffix && (
                <p className="mt-1 text-xs text-primary">
                  ✓ Name includes a valid designator
                </p>
              )}
              {!errors.llcName && (
                <p className="mt-1 text-xs text-gray-500">
                  Must contain: LLC, L.L.C., or Limited Liability Company
                </p>
              )}
            </div>

            <Input
              label="FEI/EIN Number (optional)"
              value={formData.fein}
              onChange={(e) => updateFormData({ fein: e.target.value })}
              placeholder="XX-XXXXXXX"
              maxLength={10}
            />

            <div>
              <Input
                label="Effective Date (optional)"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => updateFormData({ effectiveDate: e.target.value })}
                error={errors.effectiveDate}
              />
              <div className="mt-1 flex items-start gap-1.5 text-xs text-gray-500">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>Leave blank to use today's date. Can be up to 90 days in the future.</span>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <h3 className="mb-4 font-semibold text-navy">Contact Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email Address"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => updateFormData({ contactEmail: e.target.value })}
              error={errors.contactEmail}
              required
            />
            <Input
              label="Phone Number (optional)"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => updateFormData({ contactPhone: e.target.value })}
            />
          </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button onClick={validateAndProceed} size="lg">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
