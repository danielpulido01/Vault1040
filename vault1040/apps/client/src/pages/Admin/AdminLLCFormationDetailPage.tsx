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
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

interface LLCFormation {
  id: string;
  referenceNumber: string;
  contactEmail: string;
  contactPhone: string | null;
  llcName: string;
  fein: string | null;
  effectiveDate: string | null;
  principalOffice: { street: string; city: string; state: string; zipCode: string };
  sameAsPrincipal: boolean;
  mailingAddress: { street: string; city: string; state: string; zipCode: string } | null;
  registeredAgent: { name: string; address: { street: string; city: string; zipCode: string } };
  managementType: string;
  membersManagers: Array<{
    id: string;
    role: string;
    name: string;
    address: { street: string; city: string; state: string; zipCode: string };
  }>;
  stateFee: string;
  serviceFee: string;
  totalFee: string;
  status: string;
  paymentStatus: string;
  stripePaymentIntentId: string | null;
  paymentMethod: string | null;
  paymentLast4: string | null;
  paidAt: string | null;
  adminNotes: string | null;
  processedAt: string | null;
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
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="h-4 w-4" /> },
  PAYMENT_RECEIVED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <CreditCard className="h-4 w-4" /> },
  IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <FileText className="h-4 w-4" /> },
  SUBMITTED: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: <FileText className="h-4 w-4" /> },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <XCircle className="h-4 w-4" /> },
};

const formatCurrency = (n: string | number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n));

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const formatAddress = (a: { street: string; city: string; state?: string; zipCode: string }) =>
  `${a.street}, ${a.city}${a.state ? `, ${a.state}` : ', FL'} ${a.zipCode}`;

export function AdminLLCFormationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formation, setFormation] = useState<LLCFormation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchFormation();
  }, [id]);

  const fetchFormation = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/llc-formations/${id}`);
      const data = response.data.data.formation;
      setFormation(data);
      setEditStatus(data.status);
      setEditNotes(data.adminNotes || '');
      setEditPaymentStatus(data.paymentStatus);
    } catch (error) {
      console.error('Failed to fetch LLC formation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formation) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const response = await api.patch(`/admin/llc-formations/${id}`, {
        status: editStatus !== formation.status ? editStatus : undefined,
        adminNotes: editNotes,
        paymentStatus: editPaymentStatus !== formation.paymentStatus ? editPaymentStatus : undefined,
      });
      setFormation(response.data.data.formation);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update formation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Formation not found.</p>
        <Button variant="outline" onClick={() => navigate('/admin/llc-formations')} className="mt-4">
          Back to List
        </Button>
      </div>
    );
  }

  const statusBadge = STATUS_BADGES[formation.status] || STATUS_BADGES.PENDING;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/llc-formations')}>
          <ArrowLeft className="mr-1 h-4 w-4" /> LLC Formations
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{formation.llcName}</h1>
          <p className="font-mono text-gray-500">{formation.referenceNumber}</p>
        </div>
        <span className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
          {statusBadge.icon}
          {formation.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Business Info */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-navy">Business Information</h2>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-gray-500">LLC Name</dt><dd className="font-medium text-navy">{formation.llcName}</dd></div>
              {formation.fein && <div><dt className="text-gray-500">FEI/EIN</dt><dd className="font-medium text-navy">{formation.fein}</dd></div>}
              {formation.effectiveDate && <div><dt className="text-gray-500">Effective Date</dt><dd className="font-medium text-navy">{new Date(formation.effectiveDate).toLocaleDateString()}</dd></div>}
              <div><dt className="text-gray-500">Management</dt><dd className="font-medium text-navy">{formation.managementType === 'MEMBER_MANAGED' ? 'Member-Managed' : 'Manager-Managed'}</dd></div>
            </dl>
          </Card>

          {/* Contact */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-navy">Contact</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${formation.contactEmail}`} className="text-primary hover:underline">
                  {formation.contactEmail}
                </a>
              </div>
              {formation.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{formation.contactPhone}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Addresses */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-navy">Addresses</h2>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Principal Office</dt>
                <dd className="font-medium text-navy">{formatAddress(formation.principalOffice)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Mailing Address</dt>
                <dd className="font-medium text-navy">
                  {formation.sameAsPrincipal || !formation.mailingAddress
                    ? 'Same as principal office'
                    : formatAddress(formation.mailingAddress)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Registered Agent</dt>
                <dd className="font-medium text-navy">
                  {formation.registeredAgent.name}
                  <br />
                  <span className="text-gray-600">{formatAddress(formation.registeredAgent.address)}</span>
                </dd>
              </div>
            </dl>
          </Card>

          {/* Members / Managers */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-navy">
                {formation.managementType === 'MEMBER_MANAGED' ? 'Members' : 'Managers'}
              </h2>
            </div>
            <div className="space-y-3">
              {formation.membersManagers.map((p) => (
                <div key={p.id} className="rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="font-medium text-navy capitalize">{p.role} — {p.name}</div>
                  <div className="text-gray-500">{formatAddress(p.address)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Admin Controls */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-navy">Admin Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Payment Status</label>
                <select
                  className="input"
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SUCCEEDED">Succeeded</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="label">Admin Notes</label>
                <textarea
                  className="input min-h-[100px] resize-y"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Internal notes..."
                />
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" /> Changes saved successfully
                </div>
              )}

              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          {/* Fees */}
          <Card variant="bordered" className="bg-gray-50">
            <h2 className="mb-4 font-semibold text-navy">Fee Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">State Fee</dt>
                <dd className="font-medium">{formatCurrency(formation.stateFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Service Fee</dt>
                <dd className="font-medium">{formatCurrency(formation.serviceFee)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2">
                <dt className="font-semibold text-navy">Total</dt>
                <dd className="font-bold text-primary">{formatCurrency(formation.totalFee)}</dd>
              </div>
            </dl>
          </Card>

          {/* Payment Info */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-navy">Payment</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className={`font-medium ${formation.paymentStatus === 'SUCCEEDED' ? 'text-green-600' : 'text-gray-700'}`}>
                  {formation.paymentStatus}
                </dd>
              </div>
              {formation.paymentMethod && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Method</dt>
                  <dd className="font-medium capitalize">{formation.paymentMethod}</dd>
                </div>
              )}
              {formation.paymentLast4 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Card</dt>
                  <dd className="font-medium">****{formation.paymentLast4}</dd>
                </div>
              )}
              {formation.paidAt && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Paid At</dt>
                  <dd className="font-medium">{formatDate(formation.paidAt)}</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Timeline */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-navy">Timeline</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Submitted</dt>
                <dd className="font-medium">{formatDate(formation.createdAt)}</dd>
              </div>
              {formation.processedAt && (
                <div>
                  <dt className="text-gray-500">Processed</dt>
                  <dd className="font-medium">{formatDate(formation.processedAt)}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="font-medium">{formatDate(formation.updatedAt)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
