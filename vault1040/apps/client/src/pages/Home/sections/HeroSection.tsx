import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Shield, TrendingUp, Users, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

const stats = [
  { value: '500+', label: 'Clients Served', icon: Users },
  { value: '10+', label: 'Years Experience', icon: Award },
  { value: '98%', label: 'Satisfaction Rate', icon: CheckCircle2 },
];

export function HeroSection() {
  const { t } = useTranslation();

  const highlights = [
    { icon: Shield, text: t.home.hero.highlights.irsCompliant },
    { icon: TrendingUp, text: t.home.hero.highlights.maximizeReturns },
    { icon: Calendar, text: t.home.hero.highlights.yearRoundSupport },
  ];

  return (
    <section className="relative overflow-hidden bg-navy py-24 md:py-36">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[80px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate/20 blur-[60px]" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Subhead badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm font-semibold text-primary">{t.home.hero.badge}</span>
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {t.home.hero.title}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">{t.home.hero.titleAccent}</span>
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-primary to-primary-light" />
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 md:text-xl">
            {t.home.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/booking">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />} className="shadow-lg shadow-primary/30">
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
          <div className="mb-16 flex flex-wrap justify-center gap-4">
            {highlights.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-white/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-4 py-5 text-center">
                <Icon className="mb-1 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-white md:text-3xl">{value}</span>
                <span className="text-xs text-gray-400 md:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
