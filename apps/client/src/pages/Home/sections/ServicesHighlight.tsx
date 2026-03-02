import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { serviceIcons } from '@/data/services';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';

export function ServicesHighlight() {
  const { t } = useTranslation();

  return (
    <section className="section bg-white">
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

        <div className="grid gap-8 md:grid-cols-3">
          {t.services.items.map((service) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons];
            return (
              <Card
                key={service.id}
                variant="bordered"
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-300 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-navy">
                    {service.name}
                  </h3>
                  <p className="mb-4 text-gray-600">{service.shortDescription}</p>
                  <Link
                    to={`/services#${service.slug}`}
                    className="group/link inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all"
                  >
                    {t.common.buttons.learnMore}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
