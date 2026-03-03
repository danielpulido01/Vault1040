import { X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import type {
  Officer,
  LLCMember,
  LPPartner,
  OfficerTitle,
  LLCMemberType,
  LPPartnerType,
  Address,
} from '../types';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

interface OfficerFormProps {
  type: 'officer' | 'llc-member' | 'lp-partner';
  data: Officer | LLCMember | LPPartner;
  onChange: (data: Officer | LLCMember | LPPartner) => void;
  onRemove: () => void;
  errors?: Record<string, string>;
}

export function OfficerForm({
  type,
  data,
  onChange,
  onRemove,
  errors = {},
}: OfficerFormProps) {
  const { t } = useTranslation();

  const updateField = (field: string, value: string) => {
    if (field === 'name' || field === 'title' || field === 'type') {
      onChange({ ...data, [field]: value });
    } else {
      onChange({
        ...data,
        address: { ...(data as Officer).address, [field]: value },
      });
    }
  };

  const getTypeOptions = () => {
    if (type === 'officer') {
      return [
        { value: 'president', label: t.annualReport.officersStep.corporation.titles.president },
        { value: 'vice-president', label: t.annualReport.officersStep.corporation.titles['vice-president'] },
        { value: 'secretary', label: t.annualReport.officersStep.corporation.titles.secretary },
        { value: 'treasurer', label: t.annualReport.officersStep.corporation.titles.treasurer },
        { value: 'director', label: t.annualReport.officersStep.corporation.titles.director },
      ];
    } else if (type === 'llc-member') {
      return [
        { value: 'manager', label: t.annualReport.officersStep.llc.types.manager },
        { value: 'member', label: t.annualReport.officersStep.llc.types.member },
      ];
    } else {
      return [
        { value: 'general', label: t.annualReport.officersStep.lp.types.general },
        { value: 'limited', label: t.annualReport.officersStep.lp.types.limited },
      ];
    }
  };

  const getTypeLabel = () => {
    if (type === 'officer') return 'Title';
    if (type === 'llc-member') return 'Type';
    return 'Partner Type';
  };

  const getCurrentType = () => {
    if (type === 'officer') return (data as Officer).title;
    if (type === 'llc-member') return (data as LLCMember).type;
    return (data as LPPartner).type;
  };

  const address = (data as Officer).address;

  return (
    <Card variant="bordered" className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Type/Title Selection */}
        <div>
          <label className="label">{getTypeLabel()}</label>
          <select
            className="input"
            value={getCurrentType()}
            onChange={(e) =>
              updateField(type === 'officer' ? 'title' : 'type', e.target.value)
            }
          >
            {getTypeOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <Input
          label={t.annualReport.officersStep.name}
          value={data.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors[`${data.id}.name`]}
        />

        {/* Address */}
        <div className="sm:col-span-2">
          <Input
            label={t.annualReport.addressesStep.fields.street}
            value={address.street}
            onChange={(e) => updateField('street', e.target.value)}
            error={errors[`${data.id}.street`]}
          />
        </div>

        <Input
          label={t.annualReport.addressesStep.fields.city}
          value={address.city}
          onChange={(e) => updateField('city', e.target.value)}
          error={errors[`${data.id}.city`]}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t.annualReport.addressesStep.fields.state}</label>
            <select
              className="input"
              value={address.state}
              onChange={(e) => updateField('state', e.target.value)}
            >
              <option value="">Select</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors[`${data.id}.state`] && (
              <p className="mt-1 text-xs text-red-500">{errors[`${data.id}.state`]}</p>
            )}
          </div>
          <Input
            label={t.annualReport.addressesStep.fields.zipCode}
            value={address.zipCode}
            onChange={(e) => updateField('zipCode', e.target.value)}
            error={errors[`${data.id}.zipCode`]}
            maxLength={10}
          />
        </div>
      </div>
    </Card>
  );
}
