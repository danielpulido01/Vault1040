import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '@/i18n';

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/vault1040', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/vault1040', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/vault1040', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/vault1040', label: 'LinkedIn' },
];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-navy text-white">
      {/* Top gradient separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-3">
              <img src="/logo-white.svg" alt="Vault Tax" className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
              <div>
                <span className="block text-xl font-bold leading-tight tracking-tight">VAULT</span>
                <span className="block text-[10px] font-semibold tracking-[0.3em] text-primary">TAX</span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {t.footer.description}
            </p>

            {/* Social links */}
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/services', label: t.common.nav.services },
                { to: '/about', label: t.common.nav.about },
                { to: '/faq', label: t.common.nav.faq },
                { to: '/contact', label: t.common.nav.contact },
                { to: '/booking', label: t.common.buttons.bookConsultation },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-primary"
                  >
                    <span className="h-px w-3 bg-gray-600 transition-all group-hover:w-4 group-hover:bg-primary" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">{t.footer.services}</h3>
            <ul className="space-y-2.5">
              {t.services.items.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services#${service.slug}`}
                    className="group flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-primary"
                  >
                    <span className="h-px w-3 bg-gray-600 transition-all group-hover:w-4 group-hover:bg-primary" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">{t.footer.contactUs}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-gray-400 leading-relaxed">
                  1414 NW 107TH Ave Suite 100<br />Miami FL 33172
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                <a href="tel:+13055551040" className="text-sm text-gray-400 transition-colors hover:text-primary">
                  (305) 555-1040
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                <a href="mailto:info@vault1040.com" className="text-sm text-gray-400 transition-colors hover:text-primary">
                  info@vault1040.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            {t.footer.copyright} &copy; {new Date().getFullYear()}. {t.footer.privacyPolicy}
          </p>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-gray-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
