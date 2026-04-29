import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

const addressSchema = z.object({
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zipCode: z.string().min(1, 'Required'),
  country: z.string().default('United States'),
});

const sunbizSchema = z.object({
  documentNumber: z.string().min(1, 'Required'),
  entityType: z.string().min(1, 'Required'),
  businessName: z.string().min(1, 'Required'),
  fein: z.string().min(1, 'Required'),
  principalOffice: addressSchema,
  mailingAddress: addressSchema,
  registeredAgent: z.object({
    name: z.string().min(1, 'Required'),
    address: z.object({
      street: z.string().min(1, 'Required'),
      city: z.string().min(1, 'Required'),
      zipCode: z.string().min(1, 'Required'),
    }),
  }),
  officers: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      name: z.string().min(1, 'Name is required'),
      address: addressSchema,
    })
  ),
  llcMembers: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      name: z.string().min(1, 'Name is required'),
      address: addressSchema,
    })
  ),
});

type SunbizFormData = z.infer<typeof sunbizSchema>;

interface SunbizDataFormProps {
  clientId: string;
  reportYear: number;
  existingData: {
    documentNumber: string;
    entityType: string;
    businessName: string;
    fein: string;
    principalOffice: { street?: string; city?: string; state?: string; zipCode?: string };
    mailingAddress: { street?: string; city?: string; state?: string; zipCode?: string };
    registeredAgent: { name?: string; address?: { street?: string; city?: string; zipCode?: string } };
    officers: unknown[];
    llcMembers: unknown[];
    lpPartners: unknown[];
  } | null;
  defaultFein?: string;
  defaultDocumentNumber?: string;
  onSave: () => void;
  onCancel: () => void;
}

const ENTITY_TYPES = [
  { value: 'profit-corp', label: 'Profit Corporation' },
  { value: 'non-profit-corp', label: 'Non-Profit Corporation' },
  { value: 'llc', label: 'Limited Liability Company (LLC)' },
  { value: 'lp', label: 'Limited Partnership (LP)' },
  { value: 'lllp', label: 'Limited Liability Limited Partnership (LLLP)' },
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export function SunbizDataForm({
  clientId,
  reportYear,
  existingData,
  defaultFein,
  defaultDocumentNumber,
  onSave,
  onCancel,
}: SunbizDataFormProps) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sameAsPrincipal, setSameAsPrincipal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<SunbizFormData>({
    resolver: zodResolver(sunbizSchema),
    defaultValues: {
      documentNumber: existingData?.documentNumber || defaultDocumentNumber || '',
      entityType: existingData?.entityType || 'llc',
      businessName: existingData?.businessName || '',
      fein: existingData?.fein || defaultFein || '',
      principalOffice: {
        street: existingData?.principalOffice?.street || '',
        city: existingData?.principalOffice?.city || '',
        state: existingData?.principalOffice?.state || '',
        zipCode: existingData?.principalOffice?.zipCode || '',
        country: 'United States',
      },
      mailingAddress: {
        street: existingData?.mailingAddress?.street || '',
        city: existingData?.mailingAddress?.city || '',
        state: existingData?.mailingAddress?.state || '',
        zipCode: existingData?.mailingAddress?.zipCode || '',
        country: 'United States',
      },
      registeredAgent: {
        name: existingData?.registeredAgent?.name || '',
        address: {
          street: existingData?.registeredAgent?.address?.street || '',
          city: existingData?.registeredAgent?.address?.city || '',
          zipCode: existingData?.registeredAgent?.address?.zipCode || '',
        },
      },
      officers: (existingData?.officers as SunbizFormData['officers']) || [],
      llcMembers: (existingData?.llcMembers as SunbizFormData['llcMembers']) || [],
    },
  });

  const { fields: officerFields, append: appendOfficer, remove: removeOfficer } = useFieldArray({
    control,
    name: 'officers',
  });

  const { fields: memberFields, append: appendMember, remove: removeMember } = useFieldArray({
    control,
    name: 'llcMembers',
  });

  const principalOffice = watch('principalOffice');
  const entityType = watch('entityType');
  const documentNumber = watch('documentNumber');
  const isCorporation = entityType?.includes('corp');
  const isLLC = entityType === 'llc';

  useEffect(() => {
    if (sameAsPrincipal) {
      setValue('mailingAddress', { ...principalOffice });
    }
  }, [sameAsPrincipal, principalOffice, setValue]);

  const onSubmit = async (data: SunbizFormData) => {
    setSaving(true);
    setSaveError(null);
    try {
      await api.post(`/admin/clients/${clientId}/sunbiz`, {
        reportYear,
        ...data,
        officers: isCorporation ? data.officers : [],
        llcMembers: isLLC ? data.llcMembers : [],
        lpPartners: [],
      });
      onSave();
    } catch (error) {
      console.error('Failed to save Sunbiz data:', error);
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return;
    onCancel();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-navy">
        {existingData ? 'Edit' : 'Add'} {reportYear} Sunbiz Data
      </h3>

      {/* Entity Information */}
      <div>
        <h4 className="mb-3 font-medium text-gray-700">Entity Information</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Document Number"
              {...register('documentNumber')}
              error={errors.documentNumber?.message}
              placeholder="P160000818650"
              required
            />
            {documentNumber?.trim() && (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(documentNumber.trim())}
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Copy Number
                </button>
                <a
                  href="https://search.sunbiz.org/Inquiry/CorporationSearch/ByDocumentNumber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Sunbiz Search
                </a>
              </div>
            )}
          </div>
          <div>
            <label className="label">Entity Type *</label>
            <select className="input" {...register('entityType')}>
              {ENTITY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.entityType && (
              <p className="mt-1 text-sm text-red-500">{errors.entityType.message}</p>
            )}
          </div>
          <Input
            label="Business Name"
            {...register('businessName')}
            error={errors.businessName?.message}
            required
          />
          <Input
            label="FEIN"
            {...register('fein')}
            error={errors.fein?.message}
            placeholder="12-3456789"
            required
          />
        </div>
      </div>

      {/* Principal Office Address */}
      <div>
        <h4 className="mb-3 font-medium text-gray-700">Principal Office Address</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Street"
              {...register('principalOffice.street')}
              error={errors.principalOffice?.street?.message}
              required
            />
          </div>
          <Input
            label="City"
            {...register('principalOffice.city')}
            error={errors.principalOffice?.city?.message}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">State *</label>
              <select className="input" {...register('principalOffice.state')}>
                <option value="">Select</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.principalOffice?.state && (
                <p className="mt-1 text-sm text-red-500">{errors.principalOffice.state.message}</p>
              )}
            </div>
            <Input
              label="ZIP"
              {...register('principalOffice.zipCode')}
              error={errors.principalOffice?.zipCode?.message}
              required
            />
          </div>
        </div>
      </div>

      {/* Mailing Address */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-medium text-gray-700">Mailing Address</h4>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={sameAsPrincipal}
              onChange={(e) => {
                setSameAsPrincipal(e.target.checked);
                if (e.target.checked) setValue('mailingAddress', { ...principalOffice });
              }}
              className="h-4 w-4 rounded border-gray-300 accent-primary"
            />
            Same as Principal Office
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Street"
              {...register('mailingAddress.street')}
              error={errors.mailingAddress?.street?.message}
              disabled={sameAsPrincipal}
              required
            />
          </div>
          <Input
            label="City"
            {...register('mailingAddress.city')}
            error={errors.mailingAddress?.city?.message}
            disabled={sameAsPrincipal}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">State *</label>
              <select
                className="input"
                {...register('mailingAddress.state')}
                disabled={sameAsPrincipal}
              >
                <option value="">Select</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.mailingAddress?.state && (
                <p className="mt-1 text-sm text-red-500">{errors.mailingAddress.state.message}</p>
              )}
            </div>
            <Input
              label="ZIP"
              {...register('mailingAddress.zipCode')}
              error={errors.mailingAddress?.zipCode?.message}
              disabled={sameAsPrincipal}
              required
            />
          </div>
        </div>
      </div>

      {/* Registered Agent */}
      <div>
        <h4 className="mb-3 font-medium text-gray-700">Registered Agent (Florida)</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Agent Name"
              {...register('registeredAgent.name')}
              error={errors.registeredAgent?.name?.message}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Street"
              {...register('registeredAgent.address.street')}
              error={errors.registeredAgent?.address?.street?.message}
              required
            />
          </div>
          <Input
            label="City"
            {...register('registeredAgent.address.city')}
            error={errors.registeredAgent?.address?.city?.message}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="State" value="FL" disabled />
            <Input
              label="ZIP"
              {...register('registeredAgent.address.zipCode')}
              error={errors.registeredAgent?.address?.zipCode?.message}
              required
            />
          </div>
        </div>
      </div>

      {/* Officers (for corporations) */}
      {isCorporation && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Officers</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendOfficer({
                  id: `officer-${Date.now()}`,
                  title: 'president',
                  name: '',
                  address: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Officer
            </Button>
          </div>
          {officerFields.length === 0 ? (
            <p className="text-sm text-gray-500">No officers added yet</p>
          ) : (
            <div className="space-y-4">
              {officerFields.map((field, index) => (
                <div key={field.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <select className="input w-auto" {...register(`officers.${index}.title`)}>
                      <option value="president">President</option>
                      <option value="vice-president">Vice President</option>
                      <option value="secretary">Secretary</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="director">Director</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeOfficer(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      label="Name"
                      {...register(`officers.${index}.name`)}
                      error={errors.officers?.[index]?.name?.message}
                    />
                    <Input label="Street" {...register(`officers.${index}.address.street`)} />
                    <Input label="City" {...register(`officers.${index}.address.city`)} />
                    <div className="grid grid-cols-2 gap-2">
                      <select className="input" {...register(`officers.${index}.address.state`)}>
                        <option value="">State</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Input placeholder="ZIP" {...register(`officers.${index}.address.zipCode`)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LLC Members */}
      {isLLC && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Members/Managers</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendMember({
                  id: `member-${Date.now()}`,
                  type: 'member',
                  name: '',
                  address: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Member
            </Button>
          </div>
          {memberFields.length === 0 ? (
            <p className="text-sm text-gray-500">No members added yet</p>
          ) : (
            <div className="space-y-4">
              {memberFields.map((field, index) => (
                <div key={field.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <select className="input w-auto" {...register(`llcMembers.${index}.type`)}>
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      label="Name"
                      {...register(`llcMembers.${index}.name`)}
                      error={errors.llcMembers?.[index]?.name?.message}
                    />
                    <Input label="Street" {...register(`llcMembers.${index}.address.street`)} />
                    <Input label="City" {...register(`llcMembers.${index}.address.city`)} />
                    <div className="grid grid-cols-2 gap-2">
                      <select className="input" {...register(`llcMembers.${index}.address.state`)}>
                        <option value="">State</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="ZIP"
                        {...register(`llcMembers.${index}.address.zipCode`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="border-t pt-4">
        {saveError && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{saveError}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)} disabled={saving}>
            {saving ? 'Saving...' : 'Save Sunbiz Data'}
          </Button>
        </div>
      </div>
    </div>
  );
}
