import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { serviceIcons } from '@/data/services';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';

export function ServicesHighlight() {
  const { t } = useTranslation();

  return (
    <section className="section relative bg-white">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#0d0a24 1px, transparent 1px), linear-gradient(90deg, #0d0a24 1px, transparent 1px)',
          backgroundSize: '48px 48px',
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

        <div className="grid gap-6 md:grid-cols-3">
          {t.services.items.map((service, index) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons];
            const num = String(index + 1).padStart(2, '0');
            return (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Top accent line on hover */}
                <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 rounded-t-2xl bg-gradient-to-r from-primary to-primary-light transition-transform duration-300 group-hover:scale-x-100" />

                {/* Background number */}
                <span className="absolute right-4 top-3 font-bold text-6xl text-gray-50 transition-colors duration-300 group-hover:text-primary/10 select-none leading-none">
                  {num}
                </span>

                <div className="relative">
                  <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-navy">
                    {service.name}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-gray-500">{service.shortDescription}</p>
                  <Link
                    to={`/services#${service.slug}`}
                    className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all"
                  >
                    {t.common.buttons.learnMore}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
