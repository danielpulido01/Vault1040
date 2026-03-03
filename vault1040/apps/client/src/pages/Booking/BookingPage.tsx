import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfToday, isBefore } from 'date-fns';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { serviceIcons } from '@/data/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/features/auth/store/authStore';
import api from '@/lib/api';
import { useTranslation } from '@/i18n';

type Step = 1 | 2 | 3 | 4;

interface BookingData {
  serviceId: string;
  serviceName: string;
  date: Date | null;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export function BookingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const services = t.services.items;

  const [booking, setBooking] = useState<BookingData>({
    serviceId: '',
    serviceName: '',
    date: null,
    time: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    notes: '',
  });

  const [currentMonth, setCurrentMonth] = useState(startOfToday());

  const handleServiceSelect = (serviceId: string, serviceName: string) => {
    setBooking({ ...booking, serviceId, serviceName });
    setStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setBooking({ ...booking, date, time: '' });
  };

  const handleTimeSelect = (time: string) => {
    setBooking({ ...booking, time });
    setStep(3);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/bookings', {
        serviceId: booking.serviceId,
        scheduledDate: booking.date?.toISOString(),
        scheduledTime: booking.time,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        notes: booking.notes,
      });
      setConfirmationCode(response.data.data.booking.confirmationCode);
      setStep(4);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days: (Date | null)[] = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfToday();
    const day = date.getDay();
    // Disable past dates and weekends
    return isBefore(date, today) || day === 0 || day === 6;
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-12 md:py-16">
        <div className="container text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {t.booking.pageTitle}
          </h1>
          <p className="text-lg text-gray-300">
            {t.booking.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Steps Indicator */}
      <section className="border-b bg-white py-6">
        <div className="container">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {[
              { num: 1, label: t.booking.steps.service },
              { num: 2, label: t.booking.steps.dateTime },
              { num: 3, label: t.booking.steps.details },
              { num: 4, label: t.booking.steps.confirmation },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 md:gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step >= s.num
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.num ? <CheckCircle className="h-5 w-5" /> : s.num}
                </div>
                <span className="hidden text-sm font-medium text-gray-600 md:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-navy">
                  {t.booking.serviceStep.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {services.map((service) => {
                    const Icon = serviceIcons[service.id as keyof typeof serviceIcons];
                    return (
                      <Card
                        key={service.id}
                        variant="bordered"
                        className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                          booking.serviceId === service.id
                            ? 'border-primary ring-2 ring-primary'
                            : ''
                        }`}
                        onClick={() => handleServiceSelect(service.id, service.name)}
                      >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-navy">{service.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {service.shortDescription}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {step === 2 && (
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="mb-4"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> {t.booking.steps.service}
                </Button>

                <h2 className="mb-6 text-2xl font-bold text-navy">
                  {t.booking.dateTimeStep.title}
                </h2>

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Calendar */}
                  <Card variant="bordered">
                    <div className="mb-4 flex items-center justify-between">
                      <button
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                          )
                        }
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="font-semibold text-navy">
                        {format(currentMonth, 'MMMM yyyy')}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                          )
                        }
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-2 font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                      {generateCalendarDays().map((day, i) => (
                        <div key={i} className="aspect-square p-1">
                          {day && (
                            <button
                              disabled={isDateDisabled(day)}
                              onClick={() => handleDateSelect(day)}
                              className={`flex h-full w-full items-center justify-center rounded-lg text-sm transition-colors ${
                                isDateDisabled(day)
                                  ? 'cursor-not-allowed text-gray-300'
                                  : booking.date &&
                                    format(booking.date, 'yyyy-MM-dd') ===
                                      format(day, 'yyyy-MM-dd')
                                  ? 'bg-primary text-white'
                                  : 'hover:bg-primary/10'
                              }`}
                            >
                              {day.getDate()}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Time Slots */}
                  <div>
                    {booking.date ? (
                      <>
                        <h3 className="mb-4 font-semibold text-navy">
                          {t.booking.dateTimeStep.selectTime} - {format(booking.date, 'MMMM d, yyyy')}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                                booking.time === time
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 hover:border-primary'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        {t.booking.dateTimeStep.selectDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Enter Details */}
            {step === 3 && (
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="mb-4"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> {t.booking.steps.dateTime}
                </Button>

                <h2 className="mb-6 text-2xl font-bold text-navy">
                  {t.booking.detailsStep.title}
                </h2>

                <Card variant="bordered">
                  <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Input
                        label={t.common.labels.firstName}
                        value={booking.firstName}
                        onChange={(e) =>
                          setBooking({ ...booking, firstName: e.target.value })
                        }
                        required
                      />
                      <Input
                        label={t.common.labels.lastName}
                        value={booking.lastName}
                        onChange={(e) =>
                          setBooking({ ...booking, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Input
                        label={t.common.labels.email}
                        type="email"
                        value={booking.email}
                        onChange={(e) =>
                          setBooking({ ...booking, email: e.target.value })
                        }
                        required
                      />
                      <Input
                        label={t.common.labels.phone}
                        type="tel"
                        value={booking.phone}
                        onChange={(e) =>
                          setBooking({ ...booking, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">{t.booking.detailsStep.notes}</label>
                      <textarea
                        className="input resize-none"
                        rows={3}
                        value={booking.notes}
                        onChange={(e) =>
                          setBooking({ ...booking, notes: e.target.value })
                        }
                        placeholder={t.booking.detailsStep.notesPlaceholder}
                      />
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="mb-2 font-semibold text-navy">
                        {t.booking.confirmationStep.bookingDetails}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{t.booking.steps.service}: {booking.serviceName}</p>
                        <p>
                          {t.booking.steps.dateTime}: {booking.date && format(booking.date, 'MMMM d, yyyy')}
                        </p>
                        <p>{t.booking.dateTimeStep.selectTime}: {booking.time}</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      className="w-full"
                      size="lg"
                      isLoading={isSubmitting}
                      disabled={!booking.firstName || !booking.lastName || !booking.email}
                    >
                      {t.common.buttons.confirmBooking}
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <Card variant="elevated" className="text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
                <h2 className="mb-2 text-2xl font-bold text-navy">
                  {t.booking.confirmationStep.title}
                </h2>
                <p className="mb-6 text-gray-600">
                  {t.booking.confirmationStep.subtitle}
                </p>

                <div className="mb-6 rounded-lg bg-gray-50 p-6">
                  <p className="mb-2 text-sm text-gray-500">{t.booking.confirmationStep.confirmationCode}</p>
                  <p className="text-2xl font-bold text-navy">{confirmationCode}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>{t.booking.steps.service}:</strong> {booking.serviceName}
                  </p>
                  <p>
                    <strong>{t.booking.steps.dateTime}:</strong>{' '}
                    {booking.date && format(booking.date, 'MMMM d, yyyy')}
                  </p>
                  <p>
                    <strong>{t.booking.dateTimeStep.selectTime}:</strong> {booking.time}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  {isAuthenticated && (
                    <Button onClick={() => navigate('/dashboard')}>
                      {t.common.buttons.viewDashboard}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => navigate('/')}>
                    {t.common.buttons.returnHome}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
