import { HeroSection } from './sections/HeroSection';
import { ServicesHighlight } from './sections/ServicesHighlight';
import { WhyChooseUs } from './sections/WhyChooseUs';
import { CTASection } from './sections/CTASection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesHighlight />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
