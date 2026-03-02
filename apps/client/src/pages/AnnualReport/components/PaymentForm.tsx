import { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaymentFormProps {
  clientSecret: string;
  totalAmount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isSubmitting: boolean;
}

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1e3a5f',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

export function PaymentForm({
  clientSecret,
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
  isSubmitting,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
        },
      });

      if (error) {
        setCardError(error.message || 'Payment failed. Please try again.');
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      } else {
        setCardError('Payment was not completed. Please try again.');
        onPaymentError('Payment was not completed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setCardError(message);
      onPaymentError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {/* Card Number */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
            <CreditCard className="h-4 w-4 text-primary" />
            Card Number
          </label>
          <div className="rounded-md border border-gray-300 bg-white px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
            <CardNumberElement options={ELEMENT_OPTIONS} />
          </div>
        </div>

        {/* Expiry and CVC Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 text-primary" />
              Expiry
            </label>
            <div className="rounded-md border border-gray-300 bg-white px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <CardExpiryElement options={ELEMENT_OPTIONS} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
              <ShieldCheck className="h-4 w-4 text-primary" />
              CVC
            </label>
            <div className="rounded-md border border-gray-300 bg-white px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <CardCvcElement options={ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      </div>

      {cardError && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{cardError}</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock className="h-3 w-3" />
        <span>Secured by Stripe</span>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing || isSubmitting}
        isLoading={isProcessing || isSubmitting}
      >
        {isProcessing
          ? 'Processing...'
          : `Pay ${formatCurrency(totalAmount)} & Submit`}
      </Button>
    </form>
  );
}
