import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, Globe } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { t, language, setLanguage } = useTranslation();

  const navLinks = [
    { path: "/", label: t.common.nav.home },
    { path: "/services", label: t.common.nav.services },
    { path: "/about", label: t.common.nav.about },
    { path: "/faq", label: t.common.nav.faq },
    { path: "/contact", label: t.common.nav.contact },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore error
    }
    clearAuth();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Vault Tax" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <span className="block text-xl font-bold leading-tight text-navy">
                VAULT
              </span>
              <span className="block text-xs font-medium tracking-[0.25em] text-navy">
                TAX
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-gray-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-primary hover:text-primary"
              aria-label={t.common.language.switchTo}
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary"
                >
                  <User className="h-4 w-4" />
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  {t.common.buttons.logout}
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    {t.common.buttons.login}
                  </Button>
                </Link>
                <Link to="/booking">
                  <Button size="sm">{t.common.buttons.bookConsultation}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors ${
                      isActive ? "text-primary" : "text-gray-600"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {/* Language Switcher (Mobile) */}
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'es' : 'en');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-base font-medium text-gray-600"
              >
                <Globe className="h-5 w-5" />
                {language === 'en' ? t.common.language.spanish : t.common.language.english}
              </button>

              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-medium text-gray-600"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-base font-medium text-red-500"
                    >
                      {t.common.buttons.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        {t.common.buttons.login}
                      </Button>
                    </Link>
                    <Link
                      to="/booking"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full">{t.common.buttons.bookConsultation}</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
