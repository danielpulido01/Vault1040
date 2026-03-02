import { useState } from 'react';
import { ChevronLeft, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import { OfficerForm } from './OfficerForm';
import type {
  AnnualReportFormData,
  Officer,
  LLCMember,
  LPPartner,
} from '../types';

interface OfficersStepProps {
  formData: AnnualReportFormData;
  updateFormData: (data: Partial<AnnualReportFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const createEmptyAddress = () => ({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
});

export function OfficersStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: OfficersStepProps) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isCorporation =
    formData.entityType === 'profit-corp' || formData.entityType === 'non-profit-corp';
  const isLLC = formData.entityType === 'llc';
  const isLP = formData.entityType === 'lp' || formData.entityType === 'lllp';

  // Add new officer/member/partner
  const addOfficer = () => {
    const newOfficer: Officer = {
      id: `officer-${Date.now()}`,
      title: 'president',
      name: '',
      address: createEmptyAddress(),
    };
    updateFormData({ officers: [...formData.officers, newOfficer] });
  };

  const addLLCMember = () => {
    const newMember: LLCMember = {
      id: `member-${Date.now()}`,
      type: 'manager',
      name: '',
      address: createEmptyAddress(),
    };
    updateFormData({ llcMembers: [...formData.llcMembers, newMember] });
  };

  const addLPPartner = () => {
    const newPartner: LPPartner = {
      id: `partner-${Date.now()}`,
      type: 'general',
      name: '',
      address: createEmptyAddress(),
    };
    updateFormData({ lpPartners: [...formData.lpPartners, newPartner] });
  };

  // Update handlers
  const updateOfficer = (index: number, data: Officer) => {
    const updated = [...formData.officers];
    updated[index] = data;
    updateFormData({ officers: updated });
  };

  const updateLLCMember = (index: number, data: LLCMember) => {
    const updated = [...formData.llcMembers];
    updated[index] = data;
    updateFormData({ llcMembers: updated });
  };

  const updateLPPartner = (index: number, data: LPPartner) => {
    const updated = [...formData.lpPartners];
    updated[index] = data;
    updateFormData({ lpPartners: updated });
  };

  // Remove handlers
  const removeOfficer = (index: number) => {
    updateFormData({ officers: formData.officers.filter((_, i) => i !== index) });
  };

  const removeLLCMember = (index: number) => {
    updateFormData({ llcMembers: formData.llcMembers.filter((_, i) => i !== index) });
  };

  const removeLPPartner = (index: number) => {
    updateFormData({ lpPartners: formData.lpPartners.filter((_, i) => i !== index) });
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    // Validate based on entity type
    if (isCorporation) {
      if (formData.officers.length === 0) {
        newErrors.officers = t.annualReport.validation.officerRequired;
      } else {
        const hasPresident = formData.officers.some((o) => o.title === 'president');
        if (!hasPresident) {
          newErrors.officers = t.annualReport.validation.presidentRequired;
        }

        // Validate each officer
        formData.officers.forEach((officer) => {
          if (!officer.name) {
            newErrors[`${officer.id}.name`] = t.common.validation.required;
          }
          if (!officer.address.street) {
            newErrors[`${officer.id}.street`] = t.annualReport.validation.streetRequired;
          }
          if (!officer.address.city) {
            newErrors[`${officer.id}.city`] = t.annualReport.validation.cityRequired;
          }
          if (!officer.address.state) {
            newErrors[`${officer.id}.state`] = t.annualReport.validation.stateRequired;
          }
          if (!officer.address.zipCode || !/^\d{5}(-\d{4})?$/.test(officer.address.zipCode)) {
            newErrors[`${officer.id}.zipCode`] = t.annualReport.validation.zipCodeInvalid;
          }
        });
      }
    }

    if (isLLC) {
      if (formData.llcMembers.length === 0) {
        newErrors.llcMembers = t.annualReport.validation.memberRequired;
      } else {
        formData.llcMembers.forEach((member) => {
          if (!member.name) {
            newErrors[`${member.id}.name`] = t.common.validation.required;
          }
          if (!member.address.street) {
            newErrors[`${member.id}.street`] = t.annualReport.validation.streetRequired;
          }
          if (!member.address.city) {
            newErrors[`${member.id}.city`] = t.annualReport.validation.cityRequired;
          }
          if (!member.address.state) {
            newErrors[`${member.id}.state`] = t.annualReport.validation.stateRequired;
          }
          if (!member.address.zipCode || !/^\d{5}(-\d{4})?$/.test(member.address.zipCode)) {
            newErrors[`${member.id}.zipCode`] = t.annualReport.validation.zipCodeInvalid;
          }
        });
      }
    }

    if (isLP) {
      const hasGeneralPartner = formData.lpPartners.some((p) => p.type === 'general');
      if (!hasGeneralPartner) {
        newErrors.lpPartners = t.annualReport.validation.generalPartnerRequired;
      }

      formData.lpPartners.forEach((partner) => {
        if (!partner.name) {
          newErrors[`${partner.id}.name`] = t.common.validation.required;
        }
        if (!partner.address.street) {
          newErrors[`${partner.id}.street`] = t.annualReport.validation.streetRequired;
        }
        if (!partner.address.city) {
          newErrors[`${partner.id}.city`] = t.annualReport.validation.cityRequired;
        }
        if (!partner.address.state) {
          newErrors[`${partner.id}.state`] = t.annualReport.validation.stateRequired;
        }
        if (!partner.address.zipCode || !/^\d{5}(-\d{4})?$/.test(partner.address.zipCode)) {
          newErrors[`${partner.id}.zipCode`] = t.annualReport.validation.zipCodeInvalid;
        }
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> {t.annualReport.steps.addresses}
      </Button>

      <h2 className="mb-2 text-2xl font-bold text-navy">
        {t.annualReport.officersStep.title}
      </h2>
      <p className="mb-6 text-gray-600">{t.annualReport.officersStep.subtitle}</p>

      <div className="space-y-6">
        {/* Corporation Officers */}
        {isCorporation && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    {t.annualReport.officersStep.corporation.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t.annualReport.officersStep.corporation.requirements}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={addOfficer} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                {t.annualReport.officersStep.corporation.addOfficer}
              </Button>
            </div>

            {errors.officers && (
              <p className="text-sm text-red-500">{errors.officers}</p>
            )}

            {formData.officers.map((officer, index) => (
              <OfficerForm
                key={officer.id}
                type="officer"
                data={officer}
                onChange={(data) => updateOfficer(index, data as Officer)}
                onRemove={() => removeOfficer(index)}
                errors={errors}
              />
            ))}

            {formData.officers.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500">
                  Click "{t.annualReport.officersStep.corporation.addOfficer}" to add officers
                </p>
              </div>
            )}
          </>
        )}

        {/* LLC Members */}
        {isLLC && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    {t.annualReport.officersStep.llc.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t.annualReport.officersStep.llc.requirements}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={addLLCMember} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                {t.annualReport.officersStep.llc.addMember}
              </Button>
            </div>

            {errors.llcMembers && (
              <p className="text-sm text-red-500">{errors.llcMembers}</p>
            )}

            {formData.llcMembers.map((member, index) => (
              <OfficerForm
                key={member.id}
                type="llc-member"
                data={member}
                onChange={(data) => updateLLCMember(index, data as LLCMember)}
                onRemove={() => removeLLCMember(index)}
                errors={errors}
              />
            ))}

            {formData.llcMembers.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500">
                  Click "{t.annualReport.officersStep.llc.addMember}" to add members
                </p>
              </div>
            )}
          </>
        )}

        {/* LP Partners */}
        {isLP && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    {t.annualReport.officersStep.lp.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t.annualReport.officersStep.lp.requirements}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={addLPPartner} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                {t.annualReport.officersStep.lp.addPartner}
              </Button>
            </div>

            {errors.lpPartners && (
              <p className="text-sm text-red-500">{errors.lpPartners}</p>
            )}

            {formData.lpPartners.map((partner, index) => (
              <OfficerForm
                key={partner.id}
                type="lp-partner"
                data={partner}
                onChange={(data) => updateLPPartner(index, data as LPPartner)}
                onRemove={() => removeLPPartner(index)}
                errors={errors}
              />
            ))}

            {formData.lpPartners.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500">
                  Click "{t.annualReport.officersStep.lp.addPartner}" to add partners
                </p>
              </div>
            )}
          </>
        )}

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
