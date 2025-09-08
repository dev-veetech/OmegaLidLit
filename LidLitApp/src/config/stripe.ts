// Enhanced Stripe Configuration for LidLit App
export const STRIPE_CONFIG = {
  // Sandbox keys - Your actual Stripe sandbox keys
  publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // Apple Pay Merchant ID - Replace with your actual merchant ID
  merchantIdentifier: process.env.EXPO_PUBLIC_APPLE_PAY_MERCHANT_ID || 'merchant.com.lidlit.app',
  
  // Google Pay Merchant ID - Replace with your actual merchant ID
  googlePayMerchantId: process.env.EXPO_PUBLIC_GOOGLE_PAY_MERCHANT_ID || '',
  
  // Supported payment methods
  supportedPaymentMethods: ['card', 'apple_pay', 'google_pay'],
  
  // Currency and country
  currency: 'usd',
  country: 'US',
  
  // Enhanced Product Configuration
  products: {
    hat: {
      id: 'prod_SrRzE1tKHvkVls',
      name: 'Custom Hat',
      basePrice: 25.99,
      description: 'High-quality custom hat with your design'
    },
    customToken: {
      id: 'prod_SrRx6M8fdinH7w',
      name: 'AI Custom Token',
      basePrice: 15.99,
      description: 'AI-generated custom token design'
    },
    hatTokenCombo: {
      id: 'combo_hat_token',
      name: 'Hat + Token Combo',
      basePrice: 35.99,
      description: 'Hat with AI-generated custom token'
    }
  },
  
  // Test card numbers for sandbox
  testCards: {
    visa: '4242424242424242',
    mastercard: '5555555555554444',
    amex: '378282246310005',
    declined: '4000000000000002',
    insufficientFunds: '4000000000009995',
    expired: '4000000000000069',
    incorrectCvc: '4000000000000127',
    processingError: '4000000000000119'
  },

  // Payment Intent Configuration
  paymentIntent: {
    captureMethod: 'automatic',
    confirmationMethod: 'automatic',
    setupFutureUsage: 'off_session',
    statementDescriptor: 'LIDLIT',
    statementDescriptorSuffix: 'HAT',
  },

  // Apple Pay Configuration
  applePay: {
    merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
    countryCode: 'US',
    currencyCode: 'USD',
  },

  // Google Pay Configuration
  googlePay: {
    environment: 'test', // 'test' or 'production'
    merchantName: 'LidLit',
    allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'],
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: '0.00', // Will be set dynamically
      currencyCode: 'USD',
      countryCode: 'US',
    },
  },

  // Error Messages
  errorMessages: {
    paymentFailed: 'Payment failed. Please try again.',
    insufficientFunds: 'Insufficient funds. Please use a different card.',
    cardDeclined: 'Card was declined. Please try a different card.',
    expiredCard: 'Card has expired. Please use a different card.',
    invalidCvc: 'Invalid CVC. Please check and try again.',
    networkError: 'Network error. Please check your connection.',
    genericError: 'Something went wrong. Please try again.',
  },

  // Success Messages
  successMessages: {
    paymentSuccessful: 'Payment successful! Your order is being processed.',
    tokenGenerated: 'AI token generated successfully!',
    orderConfirmed: 'Order confirmed! Check your email for details.',
  }
};

// Stripe API endpoints (for backend integration)
export const STRIPE_API = {
  // Replace with your actual backend URL
  baseUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  createPaymentIntent: '/api/create-payment-intent',
  confirmPayment: '/api/confirm-payment',
  webhook: '/api/webhook',
  customer: '/api/customer',
  setupIntent: '/api/setup-intent',
};

// Payment method types
export const PAYMENT_METHODS = {
  CARD: 'card',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
} as const;

export type PaymentMethodType = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// Payment Status Types
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
  REQUIRES_ACTION: 'requires_action',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Payment Intent Types
export const PAYMENT_INTENT_TYPES = {
  PAYMENT: 'payment',
  SETUP: 'setup',
  SUBSCRIPTION: 'subscription',
} as const;

export type PaymentIntentType = typeof PAYMENT_INTENT_TYPES[keyof typeof PAYMENT_INTENT_TYPES];
