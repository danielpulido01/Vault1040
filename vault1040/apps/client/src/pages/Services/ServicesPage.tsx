import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { serviceIcons } from '@/data/services';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

export function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-light py-16 md:py-24">
        <img
          src="/Servicios.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="container relative text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {t.services.pageTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            {t.services.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section">
        <div className="container">
          <div className="space-y-24">
            {t.services.items.map((service, index) => {
              const Icon = serviceIcons[service.id as keyof typeof serviceIcons];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className={`flex flex-col gap-12 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-white">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-navy">
                      {service.name}
                    </h2>
                    <p className="mb-6 text-lg text-gray-600">
                      {service.description}
                    </p>
                    <ul className="mb-8 space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={service.id === 'llc-formation' ? '/llc-formation' : '/booking'}>
                      <Button rightIcon={<ArrowRight className="h-5 w-5" />}>
                        {service.id === 'llc-formation' ? 'Get Started' : t.services.ctaButton}
                      </Button>
                    </Link>
                  </div>

                  {/* Visual */}
                  <div className="flex flex-1 items-center justify-center">
                    <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 lg:h-80">
                      <Icon className="h-32 w-32 text-primary/30" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t.services.bottomCta.title}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t.services.bottomCta.description}
          </p>
          <Link to="/booking">
            <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              {t.common.buttons.bookConsultation}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
