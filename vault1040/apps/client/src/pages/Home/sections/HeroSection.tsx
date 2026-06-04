import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

export function HeroSection() {
  const { t } = useTranslation();
  const highlights = [
    t.home.hero.highlights.irsCompliant,
    t.home.hero.highlights.maximizeReturns,
    t.home.hero.highlights.yearRoundSupport,
  ];

  return (
    <section className="relative overflow-hidden bg-navy">
      <img
        src="/Home.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-20"
      />
      <div className="absolute inset-0 bg-navy/75" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-[80px]" />

      <div className="container relative py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t.home.hero.badge}
            </span>
          </div>

          <h1 className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight text-white lg:text-5xl xl:text-6xl">
            {t.home.hero.title}
            <br />
            <span className="text-primary">{t.home.hero.titleAccent}</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            {t.home.hero.subtitle}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
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

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-white">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
