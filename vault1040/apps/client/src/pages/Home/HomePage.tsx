import { HeroSection } from './sections/HeroSection';
import { ServicesHighlight } from './sections/ServicesHighlight';
import { WhyChooseUs } from './sections/WhyChooseUs';
import { TestimonialsCarousel } from './sections/TestimonialsCarousel';
import { CTASection } from './sections/CTASection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesHighlight />
      <WhyChooseUs />
      <TestimonialsCarousel />
      <CTASection />
    </>
  );
}
