import { Link } from 'react-router-dom';
import { Landmark, Network, FileCheck2, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';

const SERVICE_CARDS = [
  { id: 'tax-preparation', Icon: Landmark },
  { id: 'bookkeeping', Icon: Network },
  { id: 'corporate-setup', Icon: FileCheck2 },
];

export function ServicesHighlight() {
  const { t } = useTranslation();

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <SectionHeading
          subhead={t.home.services.subhead}
          title={
            <>
              {t.home.services.title} <AccentText>{t.home.services.titleAccent}</AccentText>
            </>
          }
          description={t.home.services.description}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {SERVICE_CARDS.map(({ id, Icon }) => {
            const service = t.services.items.find((s) => s.id === id);
            return (
              <div
                key={id}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </div>

                {/* Name */}
                <h3 className="mb-3 text-xl font-bold text-navy">{service?.name}</h3>

                {/* Benefit description */}
                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">
                  {service?.shortDescription}
                </p>

                {/* CTA */}
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300 hover:gap-3"
                >
                  Book appointment <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
