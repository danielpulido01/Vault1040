import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Save,
  Send,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

interface Filing {
  id: string;
  referenceNumber: string;
  contactEmail: string;
  contactPhone: string | null;
  documentNumber: string;
  entityType: string;
  businessName: string;
  fein: string;
  principalOffice: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  mailingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  registeredAgent: {
    name: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
    };
  };
  officers: Array<{
    id: string;
    title: string;
    name: string;
    address: { street: string; city: string; state: string; zipCode: string };
  }>;
  llcMembers: Array<{
    id: string;
    type: string;
    name: string;
    address: { street: string; city: string; state: string; zipCode: string };
  }>;
  lpPartners: Array<{
    id: string;
    type: string;
    name: string;
    address: { street: string; city: string; state: string; zipCode: string };
  }>;
  stateFee: string;
  serviceFee: string;
  lateFee: string;
  totalFee: string;
  status: string;
  paymentStatus: string;
  stripePaymentIntentId: string | null;
  paymentMethod: string | null;
  paymentLast4: string | null;
  paidAt: string | null;
  adminNotes: string | null;
  processedAt: string | null;
  processedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAYMENT_RECEIVED', label: 'Payment Received' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'SUBMITTED', label: 'Submitted to State' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const STATUS_BADGES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  LINK_SENT: { bg: 'bg-orange-100', text: 'text-orange-800', icon: <Send className="h-4 w-4" /> },
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="h-4 w-4" /> },
  PAYMENT_RECEIVED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <CreditCard className="h-4 w-4" /> },
  IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <FileText className="h-4 w-4" /> },
  SUBMITTED: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: <FileText className="h-4 w-4" /> },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <XCircle className="h-4 w-4" /> },
};

const PAYMENT_BADGES: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  SUCCEEDED: { bg: 'bg-green-100', text: 'text-green-800' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800' },
  REFUNDED: { bg: 'bg-orange-100', text: 'text-orange-800' },
};

const ENTITY_LABELS: Record<string, string> = {
  'profit-corp': 'Profit Corporation',
  'non-profit-corp': 'Non-Profit Corporation',
  'llc': 'Limited Liability Company',
  'lp': 'Limited Partnership',
  'lllp': 'Limited Liability Limited Partnership',
};

export function AdminFilingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [filing, setFiling] = useState<Filing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [externalPaymentMethod, setExternalPaymentMethod] = useState('cash');

  useEffect(() => {
    if (id) {
      fetchFiling();
    }
  }, [id]);

  const fetchFiling = async () => {
    try {
      const response = await api.get(`/admin/filings/${id}`);
      const data = response.data.data.filing;
      setFiling(data);
      setStatus(data.status);
      setAdminNotes(data.adminNotes || '');
    } catch (error) {
      console.error('Failed to fetch filing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/filings/${id}`, { status, adminNotes });
      await fetchFiling();
    } catch (error) {
      console.error('Failed to update filing:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async () => {
    setMarkingPaid(true);
    try {
      await api.patch(`/admin/filings/${id}`, {
        paymentStatus: 'SUCCEEDED',
        paymentMethod: externalPaymentMethod,
      });
      await fetchFiling();
    } catch (error) {
      console.error('Failed to mark filing as paid:', error);
    } finally {
      setMarkingPaid(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatAddress = (address: { street: string; city: string; state?: string; zipCode: string }) => {
    return `${address.street}, ${address.city}${address.state ? `, ${address.state}` : ', FL'} ${address.zipCode}`;
  };

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  if (!filing) {
    return <div className="py-8 text-center text-red-500">Filing not found</div>;
  }

  const statusBadge = STATUS_BADGES[filing.status] || STATUS_BADGES.PENDING;
  const paymentBadge = PAYMENT_BADGES[filing.paymentStatus] || PAYMENT_BADGES.PENDING;
  const isCorporation = filing.entityType.includes('corp');
  const isLLC = filing.entityType === 'llc';
  const isLP = filing.entityType === 'lp' || filing.entityType === 'lllp';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/filings')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Filings
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy">{filing.businessName}</h1>
            <p className="font-mono text-gray-500">{filing.referenceNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.icon}
              {filing.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${paymentBadge.bg} ${paymentBadge.text}`}>
              <CreditCard className="h-4 w-4" />
              {filing.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Entity Information */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-navy">Entity Information</h2>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">Document Number</dt>
                <dd className="font-medium text-navy">{filing.documentNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Entity Type</dt>
                <dd className="font-medium text-navy">{ENTITY_LABELS[filing.entityType]}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Business Name</dt>
                <dd className="font-medium text-navy">{filing.businessName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">FEIN</dt>
                <dd className="font-medium text-navy">{filing.fein}</dd>
              </div>
            </dl>
          </Card>

          {/* Addresses */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-navy">Addresses</h2>
            </div>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Principal Office</dt>
                <dd className="font-medium text-navy">{formatAddress(filing.principalOffice)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Mailing Address</dt>
                <dd className="font-medium text-navy">{formatAddress(filing.mailingAddress)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Registered Agent</dt>
                <dd className="font-medium text-navy">
                  {filing.registeredAgent.name}
                  <br />
                  <span className="font-normal text-gray-600">
                    {formatAddress(filing.registeredAgent.address)}
                  </span>
                </dd>
              </div>
            </dl>
          </Card>

          {/* Officers/Members/Partners */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-navy">
                {isCorporation ? 'Officers' : isLLC ? 'Members/Managers' : 'Partners'}
              </h2>
            </div>
            <div className="space-y-3">
              {isCorporation && filing.officers.map((officer) => (
                <div key={officer.id} className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium text-navy">
                    {officer.title} - {officer.name}
                  </p>
                  <p className="text-sm text-gray-500">{formatAddress(officer.address)}</p>
                </div>
              ))}
              {isLLC && filing.llcMembers.map((member) => (
                <div key={member.id} className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium text-navy">
                    {member.type} - {member.name}
                  </p>
                  <p className="text-sm text-gray-500">{formatAddress(member.address)}</p>
                </div>
              ))}
              {isLP && filing.lpPartners.map((partner) => (
                <div key={partner.id} className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium text-navy">
                    {partner.type} - {partner.name}
                  </p>
                  <p className="text-sm text-gray-500">{formatAddress(partner.address)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact Information */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-navy">Contact Information</h2>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{filing.contactEmail}</span>
              </div>
              {filing.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{filing.contactPhone}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Details */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-navy">Payment Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">State Fee</dt>
                <dd className="font-medium">{formatCurrency(filing.stateFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Service Fee</dt>
                <dd className="font-medium">{formatCurrency(filing.serviceFee)}</dd>
              </div>
              {Number(filing.lateFee) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Late Fee</dt>
                  <dd className="font-medium text-red-600">{formatCurrency(filing.lateFee)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t pt-3">
                <dt className="font-medium text-navy">Total</dt>
                <dd className="font-bold text-navy">{formatCurrency(filing.totalFee)}</dd>
              </div>
            </dl>

            {filing.paymentStatus === 'SUCCEEDED' ? (
              <div className="mt-4 rounded-lg bg-green-50 p-3">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Payment Received</span>
                </div>
                {filing.paymentLast4 && (
                  <p className="mt-1 text-sm text-green-600">
                    Card ending in {filing.paymentLast4}
                  </p>
                )}
                {filing.paymentMethod && !filing.paymentLast4 && (
                  <p className="mt-1 text-sm text-green-600 capitalize">
                    {filing.paymentMethod.replace(/_/g, ' ')}
                  </p>
                )}
                {filing.paidAt && (
                  <p className="text-sm text-green-600">
                    Paid on {formatDate(filing.paidAt)}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Mark as Paid</p>
                <select
                  value={externalPaymentMethod}
                  onChange={(e) => setExternalPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="wire">Wire Transfer</option>
                  <option value="card">Card (manual)</option>
                  <option value="other">Other</option>
                </select>
                <Button
                  onClick={handleMarkPaid}
                  disabled={markingPaid}
                  className="w-full"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {markingPaid ? 'Saving...' : 'Mark Payment Received'}
                </Button>
              </div>
            )}

            {filing.stripePaymentIntentId && (
              <p className="mt-3 break-all font-mono text-xs text-gray-400">
                {filing.stripePaymentIntentId}
              </p>
            )}
          </Card>

          {/* Status Management */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-navy">Manage Filing</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Internal notes about this filing..."
                />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          {/* Timestamps */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-navy">Timeline</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Submitted</dt>
                <dd className="font-medium">{formatDate(filing.createdAt)}</dd>
              </div>
              {filing.paidAt && (
                <div>
                  <dt className="text-gray-500">Payment Received</dt>
                  <dd className="font-medium">{formatDate(filing.paidAt)}</dd>
                </div>
              )}
              {filing.processedAt && (
                <div>
                  <dt className="text-gray-500">Processed</dt>
                  <dd className="font-medium">{formatDate(filing.processedAt)}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
