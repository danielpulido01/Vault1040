import { valueIcons } from '@/data/companyValues';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';

export function WhyChooseUs() {
  const { t } = useTranslation();

  return (
    <section className="section relative overflow-hidden bg-navy">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Glow */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/5 blur-[80px]" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-[80px]" />

      <div className="container relative">
        <SectionHeading
          light
          subhead={t.home.whyChooseUs.subhead}
          title={
            <>
              {t.home.whyChooseUs.title} <AccentText>{t.home.whyChooseUs.titleAccent}</AccentText>
            </>
          }
          description={t.home.whyChooseUs.description}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.values.items.map((value, index) => {
            const Icon = valueIcons[value.id as keyof typeof valueIcons];
            return (
              <div
                key={value.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-white/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Step number in background */}
                <span className="absolute right-4 top-2 text-6xl font-bold leading-none text-white/5 select-none transition-colors group-hover:text-primary/10">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:ring-primary/40">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">{value.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
