import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-20 md:py-28">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">{t.home.cta.badge}</span>
          </div>

          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {t.home.cta.title}
          </h2>
          <p className="mb-10 text-lg text-white/90">
            {t.home.cta.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/booking">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="bg-white text-primary hover:bg-gray-100"
              >
                {t.home.cta.bookButton}
              </Button>
            </Link>
            <a href="tel:+13055551040">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Phone className="h-5 w-5" />}
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-primary"
              >
                {t.home.cta.callButton}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
