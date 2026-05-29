import { Link } from 'react-router-dom';
import { Calendar, Shield, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from '@/i18n';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-navy">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Glow accents */}
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-[80px]" />

      <div className="container relative grid min-h-[580px] items-center gap-12 py-16 md:grid-cols-2 md:py-24">

        {/* Left: Content */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t.home.hero.badge}
            </span>
          </div>

          <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-white lg:text-5xl xl:text-6xl">
            {t.home.hero.title}
            <br />
            <span className="text-primary">{t.home.hero.titleAccent}</span>
          </h1>

          <p className="mb-10 max-w-md text-base leading-relaxed text-gray-300">
            {t.home.hero.subtitle}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40"
            >
              <Calendar className="h-5 w-5" />
              {t.home.hero.ctaPrimary}
            </Link>

            <a
              href="https://wa.me/13055551040"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/15"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              {t.home.hero.whatsapp}
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap gap-5 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t.home.hero.highlights.irsCompliant}
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t.home.hero.highlights.maximizeReturns}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {t.home.hero.highlights.yearRoundSupport}
            </span>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hidden items-center justify-center md:flex">
          <img
            src="/professional_services.svg"
            alt="Professional financial services"
            className="w-full max-w-md opacity-90"
          />
        </div>
      </div>
    </section>
  );
}
