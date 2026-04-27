import { useState } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

interface Officer {
  id: string;
  title: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface LLCMember {
  id: string;
  type: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

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

  // Entity Info
  const [documentNumber, setDocumentNumber] = useState(existingData?.documentNumber || defaultDocumentNumber || '');
  const [entityType, setEntityType] = useState(existingData?.entityType || 'llc');
  const [businessName, setBusinessName] = useState(existingData?.businessName || '');
  const [fein, setFein] = useState(existingData?.fein || defaultFein || '');

  // Principal Office
  const [principalOffice, setPrincipalOffice] = useState({
    street: existingData?.principalOffice?.street || '',
    city: existingData?.principalOffice?.city || '',
    state: existingData?.principalOffice?.state || '',
    zipCode: existingData?.principalOffice?.zipCode || '',
    country: 'United States',
  });

  // Mailing Address
  const [sameAsPrincipal, setSameAsPrincipal] = useState(false);
  const [mailingAddress, setMailingAddress] = useState({
    street: existingData?.mailingAddress?.street || '',
    city: existingData?.mailingAddress?.city || '',
    state: existingData?.mailingAddress?.state || '',
    zipCode: existingData?.mailingAddress?.zipCode || '',
    country: 'United States',
  });

  const updatePrincipalOffice = (updates: Partial<typeof principalOffice>) => {
    const next = { ...principalOffice, ...updates };
    setPrincipalOffice(next);
    if (sameAsPrincipal) setMailingAddress(next);
  };

  // Registered Agent
  const [registeredAgent, setRegisteredAgent] = useState({
    name: existingData?.registeredAgent?.name || '',
    address: {
      street: existingData?.registeredAgent?.address?.street || '',
      city: existingData?.registeredAgent?.address?.city || '',
      zipCode: existingData?.registeredAgent?.address?.zipCode || '',
    },
  });

  // Officers (for corporations)
  const [officers, setOfficers] = useState<Officer[]>(
    (existingData?.officers as Officer[]) || []
  );

  // LLC Members
  const [llcMembers, setLlcMembers] = useState<LLCMember[]>(
    (existingData?.llcMembers as LLCMember[]) || []
  );

  const addOfficer = () => {
    setOfficers([
      ...officers,
      {
        id: `officer-${Date.now()}`,
        title: 'president',
        name: '',
        address: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
      },
    ]);
  };

  const removeOfficer = (id: string) => {
    setOfficers(officers.filter((o) => o.id !== id));
  };

  const updateOfficer = (id: string, updates: Partial<Officer>) => {
    setOfficers(officers.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const addMember = () => {
    setLlcMembers([
      ...llcMembers,
      {
        id: `member-${Date.now()}`,
        type: 'member',
        name: '',
        address: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
      },
    ]);
  };

  const removeMember = (id: string) => {
    setLlcMembers(llcMembers.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<LLCMember>) => {
    setLlcMembers(llcMembers.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/admin/clients/${clientId}/sunbiz`, {
        reportYear,
        documentNumber,
        entityType,
        businessName,
        fein,
        principalOffice,
        mailingAddress,
        registeredAgent,
        officers: entityType.includes('corp') ? officers : [],
        llcMembers: entityType === 'llc' ? llcMembers : [],
        lpPartners: [],
      });
      onSave();
    } catch (error) {
      console.error('Failed to save Sunbiz data:', error);
    } finally {
      setSaving(false);
    }
  };

  const isCorporation = entityType.includes('corp');
  const isLLC = entityType === 'llc';

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
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="P160000818650"
              required
            />
            {documentNumber.trim() && (
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
            <select
              className="input"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
            >
              {ENTITY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <Input
            label="FEIN"
            value={fein}
            onChange={(e) => setFein(e.target.value)}
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
              value={principalOffice.street}
              onChange={(e) => updatePrincipalOffice({ street: e.target.value })}
              required
            />
          </div>
          <Input
            label="City"
            value={principalOffice.city}
            onChange={(e) => updatePrincipalOffice({ city: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">State *</label>
              <select
                className="input"
                value={principalOffice.state}
                onChange={(e) => updatePrincipalOffice({ state: e.target.value })}
              >
                <option value="">Select</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="ZIP"
              value={principalOffice.zipCode}
              onChange={(e) => updatePrincipalOffice({ zipCode: e.target.value })}
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
                if (e.target.checked) setMailingAddress({ ...principalOffice });
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
              value={mailingAddress.street}
              onChange={(e) => setMailingAddress({ ...mailingAddress, street: e.target.value })}
              disabled={sameAsPrincipal}
              required
            />
          </div>
          <Input
            label="City"
            value={mailingAddress.city}
            onChange={(e) => setMailingAddress({ ...mailingAddress, city: e.target.value })}
            disabled={sameAsPrincipal}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">State *</label>
              <select
                className="input"
                value={mailingAddress.state}
                onChange={(e) => setMailingAddress({ ...mailingAddress, state: e.target.value })}
                disabled={sameAsPrincipal}
              >
                <option value="">Select</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="ZIP"
              value={mailingAddress.zipCode}
              onChange={(e) => setMailingAddress({ ...mailingAddress, zipCode: e.target.value })}
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
              value={registeredAgent.name}
              onChange={(e) =>
                setRegisteredAgent({ ...registeredAgent, name: e.target.value })
              }
              required
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Street"
              value={registeredAgent.address.street}
              onChange={(e) =>
                setRegisteredAgent({
                  ...registeredAgent,
                  address: { ...registeredAgent.address, street: e.target.value },
                })
              }
              required
            />
          </div>
          <Input
            label="City"
            value={registeredAgent.address.city}
            onChange={(e) =>
              setRegisteredAgent({
                ...registeredAgent,
                address: { ...registeredAgent.address, city: e.target.value },
              })
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="State" value="FL" disabled />
            <Input
              label="ZIP"
              value={registeredAgent.address.zipCode}
              onChange={(e) =>
                setRegisteredAgent({
                  ...registeredAgent,
                  address: { ...registeredAgent.address, zipCode: e.target.value },
                })
              }
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
            <Button type="button" variant="outline" size="sm" onClick={addOfficer}>
              <Plus className="mr-1 h-4 w-4" />
              Add Officer
            </Button>
          </div>
          {officers.length === 0 ? (
            <p className="text-sm text-gray-500">No officers added yet</p>
          ) : (
            <div className="space-y-4">
              {officers.map((officer) => (
                <div key={officer.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <select
                      className="input w-auto"
                      value={officer.title}
                      onChange={(e) => updateOfficer(officer.id, { title: e.target.value })}
                    >
                      <option value="president">President</option>
                      <option value="vice-president">Vice President</option>
                      <option value="secretary">Secretary</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="director">Director</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeOfficer(officer.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      label="Name"
                      value={officer.name}
                      onChange={(e) => updateOfficer(officer.id, { name: e.target.value })}
                    />
                    <Input
                      label="Street"
                      value={officer.address.street}
                      onChange={(e) =>
                        updateOfficer(officer.id, {
                          address: { ...officer.address, street: e.target.value },
                        })
                      }
                    />
                    <Input
                      label="City"
                      value={officer.address.city}
                      onChange={(e) =>
                        updateOfficer(officer.id, {
                          address: { ...officer.address, city: e.target.value },
                        })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="input"
                        value={officer.address.state}
                        onChange={(e) =>
                          updateOfficer(officer.id, {
                            address: { ...officer.address, state: e.target.value },
                          })
                        }
                      >
                        <option value="">State</option>
                        {US_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <Input
                        placeholder="ZIP"
                        value={officer.address.zipCode}
                        onChange={(e) =>
                          updateOfficer(officer.id, {
                            address: { ...officer.address, zipCode: e.target.value },
                          })
                        }
                      />
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
            <Button type="button" variant="outline" size="sm" onClick={addMember}>
              <Plus className="mr-1 h-4 w-4" />
              Add Member
            </Button>
          </div>
          {llcMembers.length === 0 ? (
            <p className="text-sm text-gray-500">No members added yet</p>
          ) : (
            <div className="space-y-4">
              {llcMembers.map((member) => (
                <div key={member.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <select
                      className="input w-auto"
                      value={member.type}
                      onChange={(e) => updateMember(member.id, { type: e.target.value })}
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      label="Name"
                      value={member.name}
                      onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    />
                    <Input
                      label="Street"
                      value={member.address.street}
                      onChange={(e) =>
                        updateMember(member.id, {
                          address: { ...member.address, street: e.target.value },
                        })
                      }
                    />
                    <Input
                      label="City"
                      value={member.address.city}
                      onChange={(e) =>
                        updateMember(member.id, {
                          address: { ...member.address, city: e.target.value },
                        })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="input"
                        value={member.address.state}
                        onChange={(e) =>
                          updateMember(member.id, {
                            address: { ...member.address, state: e.target.value },
                          })
                        }
                      >
                        <option value="">State</option>
                        {US_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <Input
                        placeholder="ZIP"
                        value={member.address.zipCode}
                        onChange={(e) =>
                          updateMember(member.id, {
                            address: { ...member.address, zipCode: e.target.value },
                          })
                        }
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
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Sunbiz Data'}
        </Button>
      </div>
    </div>
  );
}
