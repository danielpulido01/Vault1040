import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, CheckCircle, CreditCard, DollarSign, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';

interface DashboardStats {
  totalClients: number;
  pendingFilings: number;
  paymentReceivedFilings: number;
  completedFilings: number;
  totalRevenue: number;
  recentClients: Array<{
    id: string;
    companyName: string;
    contactEmail: string;
    createdAt: string;
  }>;
  recentFilings: Array<{
    id: string;
    referenceNumber: string;
    businessName: string;
    status: string;
    paymentStatus: string;
    totalFee: string;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAYMENT_RECEIVED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [clientsRes, filingsStatsRes, recentFilingsRes] = await Promise.all([
        api.get('/admin/clients?limit=5'),
        api.get('/admin/filings/stats'),
        api.get('/admin/filings?limit=5'),
      ]);

      setStats({
        totalClients: clientsRes.data.data.pagination.total,
        pendingFilings: filingsStatsRes.data.data.pendingFilings + filingsStatsRes.data.data.paymentReceivedFilings,
        paymentReceivedFilings: filingsStatsRes.data.data.paymentReceivedFilings,
        completedFilings: filingsStatsRes.data.data.completedFilings,
        totalRevenue: filingsStatsRes.data.data.totalRevenue,
        recentClients: clientsRes.data.data.clients,
        recentFilings: recentFilingsRes.data.data.filings,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Dashboard</h1>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="bordered">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold text-navy">{stats?.totalClients || 0}</p>
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Filings</p>
              <p className="text-2xl font-bold text-navy">{stats?.pendingFilings || 0}</p>
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-navy">{stats?.completedFilings || 0}</p>
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-navy">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Filings */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Recent Filings</h2>
            <Link to="/admin/filings" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>

          {stats?.recentFilings && stats.recentFilings.length > 0 ? (
            <div className="divide-y">
              {stats.recentFilings.map((filing) => (
                <div key={filing.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-navy">{filing.businessName}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[filing.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {filing.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-mono">{filing.referenceNumber}</span>
                      <span>·</span>
                      <span>{formatCurrency(filing.totalFee)}</span>
                      {filing.paymentStatus === 'SUCCEEDED' && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-green-600">
                            <CreditCard className="h-3 w-3" />
                            Paid
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/admin/filings/${filing.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">No filings yet</p>
          )}
        </Card>

        {/* Recent Clients */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Recent Clients</h2>
            <Link to="/admin/clients" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>

          {stats?.recentClients && stats.recentClients.length > 0 ? (
            <div className="divide-y">
              {stats.recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy">{client.companyName}</p>
                    <p className="text-sm text-gray-500">{client.contactEmail}</p>
                  </div>
                  <Link
                    to={`/admin/clients/${client.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">No clients yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}
