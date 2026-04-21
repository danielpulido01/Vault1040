import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Send,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

interface Filing {
  id: string;
  referenceNumber: string;
  contactEmail: string;
  documentNumber: string;
  entityType: string;
  businessName: string;
  totalFee: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentLast4: string | null;
  paidAt: string | null;
  createdAt: string;
  processedAt: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Stats {
  totalFilings: number;
  linkSentFilings: number;
  pendingFilings: number;
  paymentReceivedFilings: number;
  inProgressFilings: number;
  completedFilings: number;
  totalRevenue: number;
}

const STATUS_BADGES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  LINK_SENT: { bg: 'bg-orange-100', text: 'text-orange-800', icon: <Send className="h-3 w-3" /> },
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="h-3 w-3" /> },
  PAYMENT_RECEIVED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <CreditCard className="h-3 w-3" /> },
  IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <FileText className="h-3 w-3" /> },
  SUBMITTED: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: <FileText className="h-3 w-3" /> },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <XCircle className="h-3 w-3" /> },
};

const PAYMENT_BADGES: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-800' },
  SUCCEEDED: { bg: 'bg-green-100', text: 'text-green-800' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800' },
  REFUNDED: { bg: 'bg-orange-100', text: 'text-orange-800' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

const ENTITY_LABELS: Record<string, string> = {
  'profit-corp': 'Corp',
  'non-profit-corp': 'Non-Profit',
  'llc': 'LLC',
  'lp': 'LP',
  'lllp': 'LLLP',
};

export function AdminFilingsPage() {
  const [filings, setFilings] = useState<Filing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchFilings();
    fetchStats();
  }, [currentPage, search, statusFilter]);

  const fetchFilings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const response = await api.get(`/admin/filings?${params}`);
      setFilings(response.data.data.filings);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch filings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/filings/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFilings();
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Filings</h1>
        <p className="text-gray-600">Manage annual report filings and payments</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card variant="bordered" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Send className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Link Sent</p>
              <p className="text-2xl font-bold text-navy">{stats.linkSentFilings}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Received</p>
              <p className="text-2xl font-bold text-navy">{stats.paymentReceivedFilings}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-navy">{stats.inProgressFilings}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-navy">{stats.completedFilings}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-navy">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Search & Filters */}
      <Card variant="bordered" className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by business name, email, reference #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-5 w-5" />}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="LINK_SENT">Link Sent</option>
            <option value="PENDING">Pending</option>
            <option value="PAYMENT_RECEIVED">Payment Received</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <Button type="submit">Search</Button>
        </form>
      </Card>

      {/* Filings Table */}
      <Card variant="bordered" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No filings found
                  </td>
                </tr>
              ) : (
                filings.map((filing) => {
                  const statusBadge = STATUS_BADGES[filing.status] || STATUS_BADGES.PENDING;
                  const paymentBadge = PAYMENT_BADGES[filing.paymentStatus] || PAYMENT_BADGES.PENDING;

                  return (
                    <tr key={filing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm font-medium text-navy">
                          {filing.referenceNumber}
                        </p>
                        <p className="text-xs text-gray-500">{filing.documentNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-navy">{filing.businessName}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{filing.contactEmail}</span>
                            <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                              {ENTITY_LABELS[filing.entityType] || filing.entityType}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentBadge.bg} ${paymentBadge.text}`}
                        >
                          {filing.paymentStatus === 'SUCCEEDED' && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {filing.paymentStatus === 'FAILED' && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {filing.paymentStatus === 'PENDING' && (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {filing.paymentStatus}
                        </span>
                        {filing.paymentLast4 && (
                          <p className="mt-1 text-xs text-gray-500">
                            ****{filing.paymentLast4}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                        >
                          {statusBadge.icon}
                          {filing.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-navy">{formatCurrency(filing.totalFee)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{formatDate(filing.createdAt)}</p>
                        {filing.paidAt && (
                          <p className="text-xs text-green-600">
                            Paid {formatDate(filing.paidAt)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/filings/${filing.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} filings
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
