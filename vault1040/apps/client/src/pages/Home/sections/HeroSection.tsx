import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

export function HeroSection() {
  const { t } = useTranslation();

  const highlights = [
    { icon: Shield, text: t.home.hero.highlights.irsCompliant },
    { icon: TrendingUp, text: t.home.hero.highlights.maximizeReturns },
    { icon: Calendar, text: t.home.hero.highlights.yearRoundSupport },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-navy-light py-24 md:py-36">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Subhead badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary">{t.home.hero.badge}</span>
          </div>

          {/* Main heading with underline accent */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {t.home.hero.title}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">{t.home.hero.titleAccent}</span>
              <span className="absolute -bottom-2 left-0 h-3 w-full bg-primary/20 -skew-x-3" />
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 md:text-xl">
            {t.home.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/booking">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                {t.home.hero.ctaPrimary}
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-navy"
              >
                {t.home.hero.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Highlight badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {highlights.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-3 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
