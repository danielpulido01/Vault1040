import { useState } from 'react';
import { Building2, FileText, Hash, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import type { AnnualReportFormData, EntityType } from '../types';

interface EntityInfoStepProps {
  formData: AnnualReportFormData;
  updateFormData: (data: Partial<AnnualReportFormData>) => void;
  onNext: () => void;
}

const entityTypes: EntityType[] = ['profit-corp', 'non-profit-corp', 'llc', 'lp', 'lllp'];

export function EntityInfoStep({ formData, updateFormData, onNext }: EntityInfoStepProps) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.documentNumber) {
      newErrors.documentNumber = t.annualReport.validation.documentNumberRequired;
    } else if (!/^[A-Z]\d{11,12}$/i.test(formData.documentNumber)) {
      newErrors.documentNumber = t.annualReport.validation.documentNumberInvalid;
    }

    if (!formData.businessName) {
      newErrors.businessName = t.common.validation.required;
    }

    if (!formData.fein) {
      newErrors.fein = t.annualReport.validation.feinRequired;
    } else if (!/^\d{2}-\d{7}$/.test(formData.fein)) {
      newErrors.fein = t.annualReport.validation.feinInvalid;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const formatFein = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XX-XXXXXXX
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-navy">
        {t.annualReport.entityInfoStep.title}
      </h2>
      <p className="mb-6 text-gray-600">{t.annualReport.entityInfoStep.subtitle}</p>

      <Card variant="bordered">
        <div className="space-y-6">
          {/* Document Number */}
          <div>
            <Input
              label={t.annualReport.entityInfoStep.documentNumber}
              value={formData.documentNumber}
              onChange={(e) =>
                updateFormData({ documentNumber: e.target.value.toUpperCase() })
              }
              placeholder="L12345678901"
              error={errors.documentNumber}
              leftIcon={<FileText className="h-4 w-4" />}
            />
            <p className="mt-1 text-xs text-gray-500">
              {t.annualReport.entityInfoStep.documentNumberHint}
            </p>
          </div>

          {/* Entity Type */}
          <div>
            <label className="label">{t.annualReport.entityInfoStep.entityType}</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entityTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateFormData({ entityType: type })}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                    formData.entityType === type
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      formData.entityType === type
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-navy">
                    {t.annualReport.entityInfoStep.entityTypes[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Business Name */}
          <div>
            <Input
              label={t.annualReport.entityInfoStep.businessName}
              value={formData.businessName}
              onChange={(e) => updateFormData({ businessName: e.target.value })}
              error={errors.businessName}
              leftIcon={<Briefcase className="h-4 w-4" />}
            />
            <p className="mt-1 text-xs text-amber-600">
              {t.annualReport.entityInfoStep.businessNameReadonly}
            </p>
          </div>

          {/* FEIN */}
          <div>
            <Input
              label={t.annualReport.entityInfoStep.fein}
              value={formData.fein}
              onChange={(e) => updateFormData({ fein: formatFein(e.target.value) })}
              placeholder="12-3456789"
              error={errors.fein}
              maxLength={10}
              leftIcon={<Hash className="h-4 w-4" />}
            />
            <p className="mt-1 text-xs text-gray-500">
              {t.annualReport.entityInfoStep.feinHint}
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={validateAndProceed} size="lg">
              {t.common.buttons.next}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
