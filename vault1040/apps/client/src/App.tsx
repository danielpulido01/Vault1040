import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/Home/HomePage';
import { ServicesPage } from './pages/Services/ServicesPage';
import { AboutPage } from './pages/About/AboutPage';
import { FAQPage } from './pages/FAQ/FAQPage';
import { ContactPage } from './pages/Contact/ContactPage';
import { BookingPage } from './pages/Booking/BookingPage';
import { AnnualReportPage } from './pages/AnnualReport/AnnualReportPage';
import { LLCFormationPage } from './pages/LLCFormation/LLCFormationPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { AdminRoute } from './features/auth/components/AdminRoute';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';
import { AdminClientsPage } from './pages/Admin/AdminClientsPage';
import { AdminClientDetailPage } from './pages/Admin/AdminClientDetailPage';
import { AdminFilingsPage } from './pages/Admin/AdminFilingsPage';
import { AdminFilingDetailPage } from './pages/Admin/AdminFilingDetailPage';
import { AdminAppointmentsPage } from './pages/Admin/AdminAppointmentsPage';
import { AdminLLCFormationsPage } from './pages/Admin/AdminLLCFormationsPage';
import { AdminLLCFormationDetailPage } from './pages/Admin/AdminLLCFormationDetailPage';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="appointments" element={<AdminAppointmentsPage />} />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="clients/:id" element={<AdminClientDetailPage />} />
          <Route path="filings" element={<AdminFilingsPage />} />
          <Route path="filings/:id" element={<AdminFilingDetailPage />} />
          <Route path="llc-formations" element={<AdminLLCFormationsPage />} />
          <Route path="llc-formations/:id" element={<AdminLLCFormationDetailPage />} />
        </Route>
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/annual-report" element={<AnnualReportPage />} />
        <Route path="/llc-formation" element={<LLCFormationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
