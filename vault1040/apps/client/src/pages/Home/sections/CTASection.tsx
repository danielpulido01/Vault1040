import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-navy py-20 md:py-28">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Green glow orbs */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-[60px]" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-[60px]" />

      {/* Diagonal accent stripe */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-0 h-full w-80 origin-top-right -skew-x-12 bg-primary/5" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t.home.cta.badge}</span>
          </div>

          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {t.home.cta.title}
          </h2>
          <p className="mb-10 text-lg text-gray-300">
            {t.home.cta.description}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/booking">
              <Button
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark"
              >
                {t.home.cta.bookButton}
              </Button>
            </Link>
            <a href="tel:+13055551040">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Phone className="h-5 w-5" />}
                className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10"
              >
                {t.home.cta.callButton}
              </Button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Free 30-minute consultation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
