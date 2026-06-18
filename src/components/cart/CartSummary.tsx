import { OrderCostSummary, type OrderCostSummaryProps } from '@/components/cart/OrderCostSummary';

/** @deprecated Use OrderCostSummary */
export function CartSummary(props: OrderCostSummaryProps) {
  return <OrderCostSummary {...props} />;
}

export type { OrderCostSummaryProps as CartSummaryProps };
