import { useState } from 'react';
import { ChevronLeft, Plus, Users, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { LLCFormationData, MemberManager, Address } from '../types';

interface ManagementStepProps {
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

const emptyAddress = (): Address => ({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
});

export function ManagementStep({ formData, updateFormData, onNext, onBack }: ManagementStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isMemberManaged = formData.managementType === 'MEMBER_MANAGED';
  const roleLabel = isMemberManaged ? 'member' : 'manager';

  const addPerson = () => {
    const newPerson: MemberManager = {
      id: `mm-${Date.now()}`,
      role: isMemberManaged ? 'member' : 'manager',
      name: '',
      address: emptyAddress(),
    };
    updateFormData({ membersManagers: [...formData.membersManagers, newPerson] });
  };

  const updatePerson = (index: number, updated: MemberManager) => {
    const list = [...formData.membersManagers];
    list[index] = updated;
    updateFormData({ membersManagers: list });
  };

  const removePerson = (index: number) => {
    updateFormData({ membersManagers: formData.membersManagers.filter((_, i) => i !== index) });
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    if (formData.membersManagers.length === 0) {
      newErrors.members = `At least one ${roleLabel} is required`;
    } else {
      formData.membersManagers.forEach((p) => {
        if (!p.name) newErrors[`${p.id}.name`] = 'Name is required';
        if (!p.address.street) newErrors[`${p.id}.street`] = 'Street is required';
        if (!p.address.city) newErrors[`${p.id}.city`] = 'City is required';
        if (!p.address.state) newErrors[`${p.id}.state`] = 'State is required';
        if (!p.address.zipCode || !/^\d{5}(-\d{4})?$/.test(p.address.zipCode))
          newErrors[`${p.id}.zipCode`] = 'Enter a valid ZIP code';
      });
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> Addresses
      </Button>

      <h2 className="mb-2 text-2xl font-bold text-navy">Management Structure</h2>
      <p className="mb-6 text-gray-600">
        Choose how your LLC will be managed and add the {isMemberManaged ? 'members' : 'managers'}.
      </p>

      <div className="space-y-6">
        {/* Management Type Toggle */}
        <Card variant="bordered">
          <h3 className="mb-4 font-semibold text-navy">Management Type</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => updateFormData({ managementType: 'MEMBER_MANAGED', membersManagers: [] })}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                formData.managementType === 'MEMBER_MANAGED'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-navy">Member-Managed</p>
              <p className="mt-1 text-sm text-gray-500">
                All members participate in day-to-day management. Common for small LLCs.
              </p>
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ managementType: 'MANAGER_MANAGED', membersManagers: [] })}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                formData.managementType === 'MANAGER_MANAGED'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-navy">Manager-Managed</p>
              <p className="mt-1 text-sm text-gray-500">
                Designated managers run the business. Useful for silent investors.
              </p>
            </button>
          </div>
        </Card>

        {/* Members / Managers List */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-navy capitalize">
                  {isMemberManaged ? 'Members' : 'Managers'}
                </h3>
                <p className="text-sm text-gray-500">
                  Add at least one {roleLabel}.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={addPerson} size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add {isMemberManaged ? 'Member' : 'Manager'}
            </Button>
          </div>

          {errors.members && (
            <p className="mb-3 text-sm text-red-500">{errors.members}</p>
          )}

          {formData.membersManagers.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-gray-500">
                Click "Add {isMemberManaged ? 'Member' : 'Manager'}" to continue
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.membersManagers.map((person, index) => (
                <PersonForm
                  key={person.id}
                  person={person}
                  onChange={(updated) => updatePerson(index, updated)}
                  onRemove={() => removePerson(index)}
                  errors={errors}
                  roleLabel={roleLabel}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={validateAndProceed} size="lg">Continue</Button>
        </div>
      </div>
    </div>
  );
}

function PersonForm({
  person,
  onChange,
  onRemove,
  errors,
  roleLabel,
}: {
  person: MemberManager;
  onChange: (p: MemberManager) => void;
  onRemove: () => void;
  errors: Record<string, string>;
  roleLabel: string;
}) {
  const updateField = (field: string, value: string) => {
    if (field === 'name' || field === 'role') {
      onChange({ ...person, [field]: value });
    } else {
      onChange({ ...person, address: { ...person.address, [field]: value } });
    }
  };

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
        <div>
          <label className="label">Role</label>
          <select
            className="input"
            value={person.role}
            onChange={(e) => updateField('role', e.target.value)}
          >
            <option value={roleLabel}>{roleLabel === 'member' ? 'Member' : 'Manager'}</option>
          </select>
        </div>

        <Input
          label="Full Name"
          value={person.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors[`${person.id}.name`]}
        />

        <div className="sm:col-span-2">
          <Input
            label="Street Address"
            value={person.address.street}
            onChange={(e) => updateField('street', e.target.value)}
            error={errors[`${person.id}.street`]}
          />
        </div>

        <Input
          label="City"
          value={person.address.city}
          onChange={(e) => updateField('city', e.target.value)}
          error={errors[`${person.id}.city`]}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">State</label>
            <select
              className="input"
              value={person.address.state}
              onChange={(e) => updateField('state', e.target.value)}
            >
              <option value="">Select</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors[`${person.id}.state`] && (
              <p className="mt-1 text-xs text-red-500">{errors[`${person.id}.state`]}</p>
            )}
          </div>
          <Input
            label="ZIP Code"
            value={person.address.zipCode}
            onChange={(e) => updateField('zipCode', e.target.value)}
            error={errors[`${person.id}.zipCode`]}
            maxLength={10}
          />
        </div>
      </div>
    </Card>
  );
}
