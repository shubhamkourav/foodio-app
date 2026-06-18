import { useStripe } from '@stripe/stripe-react-native';

import { APP_SCHEME, STRIPE_PUBLISHABLE_KEY } from '@/constants/config';

export function useStripePayment() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const confirmCardPayment = async (clientSecret: string) => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Stripe publishable key is not configured');
    }

    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Foodio',
      returnURL: `${APP_SCHEME}://stripe-redirect`,
    });

    if (initError) {
      throw new Error(initError.message);
    }

    const { error: presentError } = await presentPaymentSheet();

    if (presentError) {
      throw new Error(presentError.message);
    }
  };

  return {
    confirmCardPayment,
    isStripeEnabled: !!STRIPE_PUBLISHABLE_KEY,
  };
}
