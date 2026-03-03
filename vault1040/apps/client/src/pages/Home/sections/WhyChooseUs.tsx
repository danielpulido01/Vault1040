import { valueIcons } from '@/data/companyValues';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';

export function WhyChooseUs() {
  const { t } = useTranslation();

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <SectionHeading
          subhead={t.home.whyChooseUs.subhead}
          title={
            <>
              {t.home.whyChooseUs.title} <AccentText>{t.home.whyChooseUs.titleAccent}</AccentText>
            </>
          }
          description={t.home.whyChooseUs.description}
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.values.items.map((value, index) => {
            const Icon = valueIcons[value.id as keyof typeof valueIcons];
            return (
              <div
                key={value.id}
                className="group rounded-2xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-navy">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
