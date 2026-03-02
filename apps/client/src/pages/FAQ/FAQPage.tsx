import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-lg font-medium text-navy">{question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {t.faq.pageTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            {t.faq.pageSubtitle}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {t.faq.items.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-gray-50 py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-navy">
            {t.faq.stillHaveQuestions.title}
          </h2>
          <p className="mb-8 text-gray-600">
            {t.faq.stillHaveQuestions.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/contact">
              <Button variant="outline" size="lg">
                {t.common.nav.contact}
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                {t.common.buttons.bookConsultation}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
