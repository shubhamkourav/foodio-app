import { apiRequest } from './apiClient';

export const paymentsApi = {
  createIntent: (orderId: string) =>
    apiRequest<{ clientSecret: string | null; paymentIntentId: string }>(
      '/payments/create-intent',
      {
        method: 'POST',
        body: { orderId },
      },
    ),
};

export const promotionsApi = {
  list: () =>
    apiRequest<
      Array<{
        id: string;
        code: string;
        description: string;
        discountType: 'percent' | 'fixed';
        discountValue: number;
      }>
    >('/promotions', { auth: false }),

  validate: (code: string, subtotal: number) =>
    apiRequest<{ code: string; discount: number; discountType: string }>(
      '/promotions/validate',
      {
        method: 'POST',
        body: { code, subtotal },
      },
    ),
};
