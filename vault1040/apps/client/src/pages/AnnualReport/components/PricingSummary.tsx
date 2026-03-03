import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { calculateFees, isAfterMay1, STATE_FEES, SERVICE_FEE, LATE_FEE } from '../types';
import type { EntityType } from '../types';

interface PricingSummaryProps {
  entityType: EntityType;
}

export function PricingSummary({ entityType }: PricingSummaryProps) {
  const { t } = useTranslation();
  const isLate = isAfterMay1();
  const fees = calculateFees(entityType, isLate);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card variant="bordered" className="bg-gray-50">
      <h3 className="mb-4 font-semibold text-navy">
        {t.annualReport.reviewStep.feesSection}
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {t.annualReport.reviewStep.fees.stateFee}
          </span>
          <span className="font-medium text-navy">
            {formatCurrency(fees.stateFee)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {t.annualReport.reviewStep.fees.serviceFee}
          </span>
          <span className="font-medium text-navy">
            {formatCurrency(fees.serviceFee)}
          </span>
        </div>

        {fees.lateFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-red-600">
              {t.annualReport.reviewStep.fees.lateFee}
            </span>
            <span className="font-medium text-red-600">
              {formatCurrency(fees.lateFee)}
            </span>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-navy">
              {t.annualReport.reviewStep.fees.total}
            </span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(fees.total)}
            </span>
          </div>
        </div>
      </div>

      {isLate && entityType !== 'non-profit-corp' && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <p className="text-xs text-amber-700">
            {t.annualReport.reviewStep.lateWarning}
          </p>
        </div>
      )}
    </Card>
  );
}
