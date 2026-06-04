import { valueIcons } from '@/data/companyValues';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';

const teamPhotos: Record<string, string> = {
  '1': '/team/daniel.jpg',
  '2': '/team/scarlett.jpg',
  '3': '/team/genesis.jpg',
};

export function WhyChooseUs() {
  const { t } = useTranslation();
  const featuredValues = t.about.values.items.slice(0, 3);
  const featuredTestimonial = t.testimonials.items[0];

  return (
    <section className="section relative overflow-hidden bg-navy">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/5 blur-[80px]" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-[80px]" />

      <div className="container relative">
        <SectionHeading
          light
          subhead={t.home.whyChooseUs.subhead}
          title={
            <>
              {t.home.whyChooseUs.title}{' '}
              <AccentText>{t.home.whyChooseUs.titleAccent}</AccentText>
            </>
          }
          description={t.home.whyChooseUs.description}
        />

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="mb-6 max-w-xl text-sm leading-relaxed text-gray-300">
                {t.about.team.subtitle}
              </p>

              <div className="flex flex-wrap gap-6">
                {t.about.team.members.map((member) => (
                  <div key={member.id} className="group text-center">
                    <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-2 border-primary/40 ring-4 ring-primary/10 transition-all duration-300 group-hover:border-primary group-hover:ring-primary/30 sm:h-28 sm:w-28">
                      <img
                        src={teamPhotos[member.id]}
                        alt={member.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm font-bold text-white">{member.name}</p>
                    <p className="text-xs font-medium text-primary">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6">
              <p className="mb-3 text-4xl font-serif leading-none text-primary/40">"</p>
              <blockquote className="mb-4 text-sm leading-relaxed text-white">
                {featuredTestimonial.content}
              </blockquote>
              <p className="text-sm font-semibold text-white">{featuredTestimonial.name}</p>
              <p className="text-xs text-primary">
                {featuredTestimonial.role}
                {featuredTestimonial.company ? `, ${featuredTestimonial.company}` : ''}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {featuredValues.map((value, index) => {
              const Icon = valueIcons[value.id as keyof typeof valueIcons];
              return (
                <div
                  key={value.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-white/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="absolute right-4 top-2 text-6xl font-bold leading-none text-white/5 select-none transition-colors group-hover:text-primary/10">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:ring-primary/40">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-sm font-bold text-white">{value.title}</h3>
                    <p className="text-xs leading-relaxed text-gray-400">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
