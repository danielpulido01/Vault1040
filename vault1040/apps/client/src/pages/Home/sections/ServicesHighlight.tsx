import { Landmark, Network, FileCheck2 } from 'lucide-react';
import { useTranslation } from '@/i18n';

const SERVICE_STATS = [
  { id: 'tax-preparation', Icon: Landmark, count: 80, featured: false },
  { id: 'bookkeeping', Icon: Network, count: 233, featured: true },
  { id: 'corporate-setup', Icon: FileCheck2, count: 224, featured: false },
];

export function ServicesHighlight() {
  const { t } = useTranslation();

  return (
    <section className="bg-navy">
      <div className="container max-w-3xl">
        <div className="grid grid-cols-3 divide-x divide-white/10">
          {SERVICE_STATS.map(({ id, Icon, count, featured }) => {
            const service = t.services.items.find((s) => s.id === id);
            return (
              <div key={id} className="flex flex-col items-center gap-5 px-6 py-14 text-center">
                {/* Thin green icon */}
                <Icon className="h-12 w-12 text-primary" strokeWidth={1.25} />

                {/* Service name */}
                <p className="text-sm font-semibold leading-snug text-white">
                  {service?.name}
                </p>

                {/* Count badge */}
                <div
                  className={`rounded-full px-5 py-1.5 text-sm font-bold ${
                    featured
                      ? 'bg-primary text-navy font-extrabold'
                      : 'border border-white/20 text-white/70'
                  }`}
                >
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Location */}
        <p className="pb-8 text-center text-sm text-gray-500">Miami</p>
      </div>
    </section>
  );
}
