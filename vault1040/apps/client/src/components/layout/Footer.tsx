import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '@/i18n';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-navy text-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo-white.svg" alt="Vault Tax" className="h-12 w-auto" />
              <div>
                <span className="block text-xl font-bold leading-tight">VAULT</span>
                <span className="block text-xs font-medium tracking-[0.25em] text-gray-300">TAX</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-sm text-gray-400 hover:text-primary">
                  {t.common.nav.services}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-primary">
                  {t.common.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-400 hover:text-primary">
                  {t.common.nav.faq}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-primary">
                  {t.common.nav.contact}
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-sm text-gray-400 hover:text-primary">
                  {t.common.buttons.bookConsultation}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t.footer.services}</h3>
            <ul className="space-y-2">
              {t.services.items.map((service) => (
                <li key={service.id}>
                  <Link to={`/services#${service.slug}`} className="text-sm text-gray-400 hover:text-primary">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t.footer.contactUs}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm text-gray-400">
                  1414 NW 107TH Ave Suite 100<br />Miami FL 33172
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="tel:+13055551040" className="text-sm text-gray-400 hover:text-primary">
                  (305) 555-1040
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="mailto:info@vault1040.com" className="text-sm text-gray-400 hover:text-primary">
                  info@vault1040.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            {t.footer.copyright} &copy; {new Date().getFullYear()}. {t.footer.privacyPolicy}
          </p>
        </div>
      </div>
    </footer>
  );
}
