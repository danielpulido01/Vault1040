import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, Globe } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      {/* Green accent top bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-primary-light to-primary-dark" />

      <div className="container">
        <div className="flex h-16 items-center justify-between md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="Vault Tax" className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
            <div className="hidden sm:block">
              <span className="block text-xl font-bold leading-tight text-navy tracking-tight">
                VAULT
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.3em] text-primary">
                TAX
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors group ${
                    isActive ? "text-primary" : "text-gray-600 hover:text-navy"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-primary"
              aria-label={t.common.language.switchTo}
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-primary"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {user?.firstName?.[0]?.toUpperCase()}
                  </div>
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-500"
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
                  <Button size="sm" className="shadow-sm shadow-primary/20">
                    {t.common.buttons.bookConsultation}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-navy"
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
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-gray-600 hover:bg-gray-50"
              >
                <Globe className="h-5 w-5" />
                {language === 'en' ? t.common.language.spanish : t.common.language.english}
              </button>

              <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <User className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base font-medium text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
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
