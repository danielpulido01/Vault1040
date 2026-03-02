import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AccentText } from '@/components/ui/AccentText';
import { useTranslation } from '@/i18n';

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

  return (
    <section className="section bg-white">
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
          {/* Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card variant="elevated" className="mx-auto max-w-2xl overflow-hidden text-center">
                    {/* Quote icon */}
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Quote className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="mb-6 text-lg leading-relaxed text-gray-600">
                      "{testimonial.content}"
                    </p>

                    {/* Stars */}
                    <div className="mb-4 flex justify-center gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="border-t border-gray-100 pt-4">
                      <p className="font-semibold text-navy">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                        {testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:-translate-y-1/2 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary md:-left-6"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-navy" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:-translate-y-1/2 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary md:-right-6"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-navy" />
          </button>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-primary' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
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
