import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const avatarColors = [
  'from-primary to-primary-dark',
  'from-slate to-slate-dark',
  'from-navy-light to-navy',
  'from-emerald-500 to-teal-600',
];

export function TestimonialsCarousel() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = t.testimonials.items;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisible = () => {
    const len = testimonials.length;
    if (len <= 3) return testimonials.map((_, i) => i);
    return [
      (currentIndex - 1 + len) % len,
      currentIndex,
      (currentIndex + 1) % len,
    ];
  };

  const visibleIndices = getVisible();

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <SectionHeading
          subhead={t.home.testimonials.subhead}
          title={
            <>
              {t.home.testimonials.title} <AccentText>{t.home.testimonials.titleAccent}</AccentText>
            </>
          }
          description={t.home.testimonials.description}
        />

        <div className="relative">
          {/* Desktop: 3-column grid */}
          <div className="hidden gap-5 md:grid md:grid-cols-3">
            {visibleIndices.map((idx, position) => {
              const testimonial = testimonials[idx];
              const isCenter = position === 1;
              return (
                <div
                  key={testimonial.id}
                  className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all duration-500 ${
                    isCenter
                      ? 'border-primary/30 shadow-lg shadow-primary/10 scale-[1.02]'
                      : 'border-gray-100 opacity-80'
                  }`}
                >
                  <div className="mb-3 text-5xl font-serif leading-none text-primary/20 select-none">"</div>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600">
                    {testimonial.content}
                  </p>
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${
                        avatarColors[idx % avatarColors.length]
                      }`}
                    >
                      {getInitials(testimonial.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">
                        {testimonial.role}
                        {testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: single card carousel */}
          <div className="overflow-hidden md:hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, idx) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-1">
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-3 text-5xl font-serif leading-none text-primary/20 select-none">"</div>
                    <p className="mb-5 text-sm leading-relaxed text-gray-600">
                      {testimonial.content}
                    </p>
                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${
                          avatarColors[idx % avatarColors.length]
                        }`}
                      >
                        {getInitials(testimonial.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">
                          {testimonial.role}
                          {testimonial.company && `, ${testimonial.company}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-md transition-all hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary md:-left-5"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-navy" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-md transition-all hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary md:-right-5"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-navy" />
          </button>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
