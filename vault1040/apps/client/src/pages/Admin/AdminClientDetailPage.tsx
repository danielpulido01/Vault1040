import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Link as LinkIcon,
  Copy,
  Check,
  Trash2,
  DollarSign,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { SunbizDataForm } from './components/SunbizDataForm';

const clientSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string(),
  documentNumber: z.string(),
  fein: z.string(),
  notes: z.string(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface JsonAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface JsonRegisteredAgent {
  name?: string;
  address?: JsonAddress;
}

interface RelatedFiling {
  id: string;
  referenceNumber: string;
  documentNumber: string;
  entityType: string;
  businessName: string;
  fein: string;
  principalOffice: JsonAddress;
  mailingAddress: JsonAddress;
  registeredAgent: JsonRegisteredAgent;
  officers: unknown[];
  llcMembers: unknown[];
  lpPartners: unknown[];
  status: string;
  createdAt: string;
}

interface Client {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string | null;
  documentNumber: string | null;
  fein: string | null;
  notes: string | null;
  createdAt: string;
  sunbizData: SunbizData[];
  prefillTokens: PrefillToken[];
  relatedFilings: RelatedFiling[];
}

interface SunbizData {
  id: string;
  reportYear: number;
  documentNumber: string;
  entityType: string;
  businessName: string;
  fein: string;
  principalOffice: JsonAddress;
  mailingAddress: JsonAddress;
  registeredAgent: JsonRegisteredAgent;
  officers: unknown[];
  llcMembers: unknown[];
  lpPartners: unknown[];
  createdAt: string;
}

interface PrefillToken {
  id: string;
  token: string;
  reportYear: number;
  expiresAt: string;
  usedAt: string | null;
  submittedAt: string | null;
  emailSentAt: string | null;
  createdAt: string;
  // External payment confirmation
  paymentConfirmed: boolean;
  paymentConfirmedAt: string | null;
  externalPaymentMethod: string | null;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'subscription', label: 'Subscription Bundle' },
  { value: 'wire', label: 'Wire Transfer' },
  { value: 'ach', label: 'ACH Transfer' },
  { value: 'other', label: 'Other' },
];

export function AdminClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [generatingToken, setGeneratingToken] = useState(false);
  const [regeneratingToken, setRegeneratingToken] = useState<number | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // External payment confirmation
  const [confirmingPayment, setConfirmingPayment] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: '',
      contactEmail: '',
      contactPhone: '',
      documentNumber: '',
      fein: '',
      notes: '',
    },
  });

  const [watchedFein, watchedDocumentNumber, watchedCompanyName] = watch([
    'fein',
    'documentNumber',
    'companyName',
  ]);

  // Sunbiz data form visibility
  const [showSunbizForm, setShowSunbizForm] = useState(false);
  const [editingYear, setEditingYear] = useState<number | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      fetchClient();
    }
  }, [id, isNew]);

  const fetchClient = async () => {
    try {
      const response = await api.get(`/admin/clients/${id}`);
      const clientData = response.data.data.client;
      setClient(clientData);
      reset({
        companyName: clientData.companyName,
        contactEmail: clientData.contactEmail,
        contactPhone: clientData.contactPhone || '',
        documentNumber: clientData.documentNumber || '',
        fein: clientData.fein || '',
        notes: clientData.notes || '',
      });
    } catch (error) {
      console.error('Failed to fetch client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: ClientFormData) => {
    setSaving(true);
    try {
      if (isNew) {
        const response = await api.post('/admin/clients', data);
        navigate(`/admin/clients/${response.data.data.client.id}`);
      } else {
        await api.put(`/admin/clients/${id}`, data);
        fetchClient();
      }
    } catch (error) {
      console.error('Failed to save client:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client? This cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/admin/clients/${id}`);
      navigate('/admin/clients');
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const handleRegenerateToken = async (reportYear: number) => {
    if (!confirm('This will invalidate the current link and generate a new one. Continue?')) return;
    setRegeneratingToken(reportYear);
    try {
      const response = await api.post(`/admin/clients/${id}/regenerate-token`, { reportYear });
      fetchClient();
      const url = response.data.data.prefillUrl;
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 3000);
    } catch (error) {
      console.error('Failed to regenerate token:', error);
    } finally {
      setRegeneratingToken(null);
    }
  };

  const handleGenerateToken = async (reportYear: number) => {
    setGeneratingToken(true);
    try {
      const response = await api.post(`/admin/clients/${id}/generate-token`, {
        reportYear,
      });
      fetchClient();
      // Copy URL to clipboard
      const url = response.data.data.prefillUrl;
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 3000);
    } catch (error) {
      console.error('Failed to generate token:', error);
    } finally {
      setGeneratingToken(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  const handleSendEmail = async (tokenId: string) => {
    setSendingEmail(tokenId);
    try {
      await api.post(`/admin/clients/${id}/send-email`, { tokenId });
      fetchClient();
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please check the Mailchimp configuration.');
    } finally {
      setSendingEmail(null);
    }
  };

  const handleSunbizSaved = () => {
    setShowSunbizForm(false);
    setEditingYear(null);
    fetchClient();
  };

  const handleConfirmPayment = async (tokenId: string) => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setSavingPayment(true);
    try {
      await api.post(`/admin/clients/${id}/confirm-payment`, {
        tokenId,
        paymentMethod,
        notes: paymentNotes || undefined,
      });
      setConfirmingPayment(null);
      setPaymentMethod('');
      setPaymentNotes('');
      fetchClient();
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      alert('Failed to confirm payment');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleRevokePayment = async (tokenId: string) => {
    if (!confirm('Are you sure you want to revoke this payment confirmation?')) {
      return;
    }
    try {
      await api.post(`/admin/clients/${id}/revoke-payment`, { tokenId });
      fetchClient();
    } catch (error) {
      console.error('Failed to revoke payment:', error);
      alert('Failed to revoke payment confirmation');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/clients"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-navy">
            {isNew ? 'New Client' : watchedCompanyName}
          </h1>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button type="button" onClick={handleSubmit(handleSave)} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card variant="bordered">
            <h2 className="mb-4 text-lg font-semibold text-navy">Client Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Company Name"
                {...register('companyName')}
                error={errors.companyName?.message}
                required
              />
              <Input
                label="Contact Email"
                type="email"
                {...register('contactEmail')}
                error={errors.contactEmail?.message}
                required
              />
              <Input
                label="Contact Phone"
                {...register('contactPhone')}
              />
              <Input
                label="FL Document Number"
                {...register('documentNumber')}
                placeholder="P160000818650"
              />
              <Input
                label="FEIN"
                {...register('fein')}
                placeholder="12-3456789"
              />
            </div>
            <div className="mt-4">
              <label className="label">Notes</label>
              <textarea className="input min-h-[100px]" {...register('notes')} />
            </div>
          </Card>

          {/* Sunbiz Data */}
          {!isNew && (
            <Card variant="bordered">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-navy">Sunbiz Data</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingYear(currentYear);
                    setShowSunbizForm(true);
                  }}
                >
                  Add {currentYear} Data
                </Button>
              </div>

              {showSunbizForm && (() => {
                const year = editingYear || currentYear;
                const sunbiz = client?.sunbizData.find((s) => s.reportYear === year);
                // Use the most recent related filing to fill in any missing fields
                const filing = client?.relatedFilings?.[0];
                const mergedData = sunbiz
                  ? {
                      ...sunbiz,
                      registeredAgent: {
                        name: sunbiz.registeredAgent?.name || filing?.registeredAgent?.name || '',
                        address: sunbiz.registeredAgent?.address?.street
                          ? sunbiz.registeredAgent.address
                          : filing?.registeredAgent?.address || { street: '', city: '', zipCode: '' },
                      },
                      llcMembers:
                        (sunbiz.llcMembers as unknown[]).length > 0
                          ? sunbiz.llcMembers
                          : (filing?.llcMembers as unknown[]) || [],
                      officers:
                        (sunbiz.officers as unknown[]).length > 0
                          ? sunbiz.officers
                          : (filing?.officers as unknown[]) || [],
                    }
                  : null;
                return (
                  <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <SunbizDataForm
                      key={year}
                      clientId={id!}
                      reportYear={year}
                      existingData={mergedData}
                      defaultFein={watchedFein || undefined}
                      defaultDocumentNumber={watchedDocumentNumber || undefined}
                      onSave={handleSunbizSaved}
                      onCancel={() => {
                        setShowSunbizForm(false);
                        setEditingYear(null);
                      }}
                    />
                  </div>
                );
              })()}

              {client?.sunbizData && client.sunbizData.length > 0 ? (
                <div className="divide-y">
                  {client.sunbizData.map((data) => (
                    <div key={data.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-navy">{data.reportYear}</p>
                        <p className="text-sm text-gray-500">
                          {data.entityType} - {data.businessName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingYear(data.reportYear);
                          setShowSunbizForm(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">No Sunbiz data entered yet</p>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar - Tokens */}
        {!isNew && (
          <div className="space-y-6">
            <Card variant="bordered">
              <h2 className="mb-4 text-lg font-semibold text-navy">Pre-fill Links</h2>

              {client?.sunbizData && client.sunbizData.length > 0 ? (
                <div className="space-y-4">
                  {client.sunbizData.map((data) => {
                    const token = client.prefillTokens.find(
                      (t) => t.reportYear === data.reportYear && !t.submittedAt
                    );
                    return (
                      <div key={data.reportYear} className="rounded-lg border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">{data.reportYear}</span>
                          {token ? (
                            <span className="text-xs text-green-600">Active</span>
                          ) : (
                            <span className="text-xs text-gray-400">No link</span>
                          )}
                        </div>

                        {token ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                readOnly
                                value={`${window.location.origin}/annual-report?token=${token.token}`}
                                className="flex-1 rounded border bg-gray-50 px-2 py-1 text-xs"
                              />
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    `${window.location.origin}/annual-report?token=${token.token}`
                                  )
                                }
                                className="rounded p-1 hover:bg-gray-100"
                              >
                                {copiedUrl?.includes(token.token) ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              {token.usedAt && (
                                <span className="text-blue-500">Viewed</span>
                              )}
                              {token.submittedAt && (
                                <span className="text-green-500">Submitted</span>
                              )}
                              {token.emailSentAt && (
                                <span className="text-purple-500">Emailed</span>
                              )}
                              {token.paymentConfirmed && (
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  Paid ({token.externalPaymentMethod})
                                </span>
                              )}
                            </div>

                            {/* Payment confirmation UI */}
                            {!token.paymentConfirmed && !token.submittedAt && (
                              <div className="border-t pt-2 mt-2">
                                {confirmingPayment === token.id ? (
                                  <div className="space-y-2">
                                    <select
                                      value={paymentMethod}
                                      onChange={(e) => setPaymentMethod(e.target.value)}
                                      className="w-full rounded border px-2 py-1 text-xs"
                                    >
                                      <option value="">Select payment method...</option>
                                      {PAYMENT_METHODS.map((m) => (
                                        <option key={m.value} value={m.value}>
                                          {m.label}
                                        </option>
                                      ))}
                                    </select>
                                    <input
                                      type="text"
                                      placeholder="Notes (optional)"
                                      value={paymentNotes}
                                      onChange={(e) => setPaymentNotes(e.target.value)}
                                      className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleConfirmPayment(token.id)}
                                        disabled={savingPayment || !paymentMethod}
                                        className="flex-1 rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                                      >
                                        {savingPayment ? 'Saving...' : 'Confirm'}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setConfirmingPayment(null);
                                          setPaymentMethod('');
                                          setPaymentNotes('');
                                        }}
                                        className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmingPayment(token.id)}
                                    className="flex w-full items-center justify-center gap-1 rounded border border-green-200 bg-green-50 px-2 py-1 text-xs text-green-700 hover:bg-green-100"
                                  >
                                    <DollarSign className="h-3 w-3" />
                                    Confirm External Payment
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Revoke payment option */}
                            {token.paymentConfirmed && !token.submittedAt && (
                              <button
                                onClick={() => handleRevokePayment(token.id)}
                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                              >
                                <XCircle className="h-3 w-3" />
                                Revoke Payment
                              </button>
                            )}

                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => handleRegenerateToken(data.reportYear)}
                                disabled={regeneratingToken === data.reportYear}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <RefreshCw className="h-3 w-3" />
                                {regeneratingToken === data.reportYear ? 'Resetting...' : 'Reset Link'}
                              </button>
                              {!token.emailSentAt && (
                                <button
                                  onClick={() => handleSendEmail(token.id)}
                                  disabled={sendingEmail === token.id}
                                  className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-white hover:bg-primary/90 disabled:opacity-50"
                                >
                                  <Send className="h-3 w-3" />
                                  {sendingEmail === token.id ? 'Sending...' : 'Send Email'}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleGenerateToken(data.reportYear)}
                            disabled={generatingToken}
                          >
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Generate Link
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  Add Sunbiz data first to generate pre-fill links
                </p>
              )}
            </Card>

            {/* Quick Actions */}
            <Card variant="bordered">
              <h2 className="mb-4 text-lg font-semibold text-navy">Quick Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!client?.prefillTokens.some((t) => !t.submittedAt)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
