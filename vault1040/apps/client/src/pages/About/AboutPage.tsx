import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { valueIcons } from '@/data/companyValues';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {t.about.pageTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            {t.about.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title">{t.about.story.title}</h2>
            <p className="text-lg text-gray-600">
              {t.about.story.paragraph1}
            </p>
            <p className="mt-4 text-lg text-gray-600">
              {t.about.story.paragraph2}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">{t.about.values.title}</h2>
            <p className="section-subtitle mx-auto">
              {t.about.values.subtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.about.values.items.map((value) => {
              const Icon = valueIcons[value.id as keyof typeof valueIcons];
              return (
                <Card key={value.id} variant="elevated" className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-navy">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">{t.about.team.title}</h2>
            <p className="section-subtitle mx-auto">
              {t.about.team.subtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.about.team.members.map((member) => {
              const photoMap: Record<string, string> = {
                '1': '/team/daniel.jpg',
                '2': '/team/scarlett.jpg',
                '3': '/team/genesis.jpg',
              };
              return (
                <Card key={member.id} variant="bordered" className="text-center">
                  <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-primary/30 ring-4 ring-primary/10">
                    <img
                      src={photoMap[member.id]}
                      alt={member.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-navy">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-primary">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t.about.cta.title}
          </h2>
          <p className="mb-8 text-lg text-white/90">
            {t.about.cta.description}
          </p>
          <Link to="/booking">
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              {t.common.buttons.bookConsultation}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
