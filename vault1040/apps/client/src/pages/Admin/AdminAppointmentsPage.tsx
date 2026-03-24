import { useEffect, useState } from 'react';
import { Calendar, Clock, Search, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';

interface Booking {
  id: string;
  confirmationCode: string;
  scheduledDate: string;
  scheduledTime: string;
  endTime: string;
  duration: number;
  status: string;
  notes: string | null;
  guestFirstName: string | null;
  guestLastName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  user: { id: string; firstName: string; lastName: string; email: string } | null;
  service: { id: string; name: string; duration: number };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-gray-100 text-gray-800',
};

const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

export function AdminAppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [search, statusFilter, page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get(`/admin/bookings?${params}`);
      setBookings(res.data.data.bookings);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getClientName = (b: Booking) => {
    if (b.user) return `${b.user.firstName} ${b.user.lastName}`;
    if (b.guestFirstName) return `${b.guestFirstName} ${b.guestLastName}`;
    return 'Guest';
  };

  const getClientEmail = (b: Booking) => b.user?.email ?? b.guestEmail ?? '—';

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Appointments</h1>

      {/* Filters */}
      <Card variant="bordered" className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, code…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card variant="bordered">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading…</div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No appointments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-semibold uppercase text-gray-500">
                  <th className="pb-3 pr-4">Client</th>
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 pr-4">Date & Time</th>
                  <th className="pb-3 pr-4">Code</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b) => (
                  <tr key={b.id} className="align-top">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-navy">{getClientName(b)}</p>
                      <p className="text-xs text-gray-500">{getClientEmail(b)}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-navy">{b.service.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />{b.duration} min
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="flex items-center gap-1 text-navy">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {formatDate(b.scheduledDate)}
                      </p>
                      <p className="text-xs text-gray-500">{b.scheduledTime} – {b.endTime}</p>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-600">{b.confirmationCode}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {b.status === 'PENDING' && (
                          <button
                            onClick={() => updateStatus(b.id, 'CONFIRMED')}
                            disabled={updatingId === b.id}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          >
                            <CheckCircle className="h-3 w-3" /> Confirm
                          </button>
                        )}
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <>
                            <button
                              onClick={() => updateStatus(b.id, 'COMPLETED')}
                              disabled={updatingId === b.id}
                              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                            >
                              <CheckCircle className="h-3 w-3" /> Complete
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, 'CANCELLED')}
                              disabled={updatingId === b.id}
                              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                            >
                              <XCircle className="h-3 w-3" /> Cancel
                            </button>
                          </>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateStatus(b.id, 'NO_SHOW')}
                            disabled={updatingId === b.id}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                          >
                            No Show
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
