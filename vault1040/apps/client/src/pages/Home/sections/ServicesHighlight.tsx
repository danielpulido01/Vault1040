import { Link } from 'react-router-dom';
import { ArrowRight, Check, MoveRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';
import { serviceIcons } from '@/data/services';

const FEATURED_SERVICE_ID = 'llc-formation';
const SECONDARY_SERVICE_IDS = ['corporate-setup', 'tax-preparation', 'bookkeeping'] as const;

export function ServicesHighlight() {
  const { t } = useTranslation();
  const featuredService = t.services.items.find((service) => service.id === FEATURED_SERVICE_ID);
  const secondaryServices = SECONDARY_SERVICE_IDS.map((id) =>
    t.services.items.find((service) => service.id === id),
  ).filter((service) => service !== undefined);

  if (!featuredService) {
    return null;
  }

  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container relative">
        <SectionHeading
          subhead={t.home.services.subhead}
          title={
            <>
              {t.home.services.title} <AccentText>{t.home.services.titleAccent}</AccentText>
            </>
          }
          description={t.home.services.description}
        />

        <div className="mb-8 overflow-hidden rounded-[28px] border border-primary/25 bg-[linear-gradient(135deg,#0f1f38_0%,#16345d_100%)] p-6 shadow-[0_24px_80px_rgba(15,31,56,0.24)] lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-10 lg:p-10">
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-navy">
              <span className="h-2 w-2 rounded-full bg-navy" />
              {t.home.services.featuredBadge}
            </div>

            <div className="pointer-events-none absolute right-0 top-0 hidden select-none text-[6rem] font-bold leading-none tracking-[-0.08em] text-primary/10 lg:block">
              LLC
            </div>

            <h3 className="max-w-xl text-3xl font-bold leading-tight text-white md:text-4xl">
              {featuredService.name}
            </h3>
            <p className="mt-3 max-w-xl text-lg italic text-primary">
              {featuredService.shortDescription}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
              {featuredService.description}
            </p>

            <Link
              to="/llc-formation"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-navy transition-all duration-300 hover:translate-x-1 hover:bg-primary-dark hover:text-white"
            >
              {t.services.ctaButton}
              <MoveRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.06] p-5 lg:mt-0 lg:p-6">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              {t.home.services.featuredIncludes}
            </p>

            <div className="space-y-3">
              {featuredService.features.slice(0, 4).map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0b1830]/55 p-4"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {secondaryServices.map((service) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons];

            return (
              <div
                key={service.id}
                className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#0f1f38_0%,#142b4e_100%)] p-7 shadow-[0_16px_50px_rgba(15,31,56,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_20px_60px_rgba(15,31,56,0.2)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-navy">
                  <Icon className="h-7 w-7" strokeWidth={1.6} />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-white">{service.name}</h3>
                <p className="mb-5 text-sm leading-relaxed text-slate-300">
                  {service.shortDescription}
                </p>

                <ul className="mb-6 space-y-2 text-sm text-slate-200">
                  {service.features.slice(0, 2).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/booking"
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 hover:gap-3"
                >
                  {t.services.ctaButton}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
