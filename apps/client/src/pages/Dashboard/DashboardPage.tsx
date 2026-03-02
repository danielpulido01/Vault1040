import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, User, FileText, Plus, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { useTranslation } from '@/i18n';

interface Booking {
  id: string;
  confirmationCode: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  service: {
    name: string;
  };
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data.data.bookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm(t.dashboard.cancelConfirm)) return;

    try {
      await api.post(`/bookings/${bookingId}/cancel`, { reason: 'Cancelled by user' });
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
        )
      );
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'PENDING' || b.status === 'CONFIRMED'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className="section bg-gray-50">
      <div className="container">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">
              {t.dashboard.welcome}, {user?.firstName}!
            </h1>
            <p className="text-gray-600">{t.dashboard.subtitle}</p>
          </div>
          <Link to="/booking">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              {t.common.buttons.bookNewConsultation}
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card variant="elevated" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">
                {upcomingBookings.length}
              </p>
              <p className="text-sm text-gray-500">{t.dashboard.stats.upcomingAppointments}</p>
            </div>
          </Card>

          <Card variant="elevated" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{bookings.length}</p>
              <p className="text-sm text-gray-500">{t.dashboard.stats.totalBookings}</p>
            </div>
          </Card>

          <Card variant="elevated" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{t.dashboard.stats.active}</p>
              <p className="text-sm text-gray-500">{t.dashboard.stats.accountStatus}</p>
            </div>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card variant="elevated" className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-navy">
            {t.dashboard.upcoming.title}
          </h2>

          {isLoading ? (
            <div className="py-8 text-center text-gray-500">{t.dashboard.upcoming.loading}</div>
          ) : upcomingBookings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="mb-4 text-gray-500">{t.dashboard.upcoming.noAppointments}</p>
              <Link to="/booking">
                <Button variant="outline">{t.common.buttons.bookFirstConsultation}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">
                        {booking.service.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(booking.scheduledDate), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.scheduledTime}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {t.dashboard.upcoming.code}: {booking.confirmationCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    {(booking.status === 'PENDING' ||
                      booking.status === 'CONFIRMED') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="mr-1 h-4 w-4" />
                        {t.common.buttons.cancel}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Past Appointments */}
        {pastBookings.length > 0 && (
          <Card variant="elevated">
            <h2 className="mb-4 text-xl font-bold text-navy">
              {t.dashboard.past.title}
            </h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 opacity-75 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        {booking.service.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>
                          {format(new Date(booking.scheduledDate), 'MMM d, yyyy')}
                        </span>
                        <span>{booking.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`self-start rounded-full px-3 py-1 text-xs font-medium sm:self-auto ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
