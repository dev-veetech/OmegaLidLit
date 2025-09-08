import { Alert } from 'react-native';
import { STRIPE_CONFIG, STRIPE_API } from '../config/stripe';
import { PAYMENT_METHODS, PaymentMethodType } from '../config/stripe';
import mockBackend from './mockBackend';
import stripeBackend from './stripeBackend';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  card?: {
    brand: string;
    last4: string;
  };
}

export interface ProductPayment {
  productId: string;
  productType: 'hat' | 'customToken';
  amount: number;
  metadata?: Record<string, string>;
}

export class PaymentService {
  private static instance: PaymentService;
  private useMockBackend: boolean = false; // Set to false to use real Stripe
  private useRealStripeBackend: boolean = true; // ENABLED: Using real Stripe backend service
  private paymentStatusListeners: Map<string, (status: string) => void> = new Map();

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Create a payment intent for a specific product
   */
  async createProductPaymentIntent(productPayment: ProductPayment): Promise<PaymentIntent | null> {
    try {
      if (this.useMockBackend) {
        // Use mock backend for testing
        const mockIntent = await mockBackend.createPaymentIntent(productPayment.amount, STRIPE_CONFIG.currency);
        return {
          id: mockIntent.id,
          amount: mockIntent.amount / 100, // Convert back from cents
          currency: mockIntent.currency,
          status: mockIntent.status,
          client_secret: mockIntent.client_secret,
        };
      }



      if (this.useRealStripeBackend) {
        // Use REAL Stripe backend service - This will create actual payment intents!
        console.log('🎯 Using REAL Stripe backend service...');
        
        let productType: 'hat' | 'customToken' | 'hat_token' = 'hat';
        if (productPayment.productType === 'customToken') {
          productType = 'customToken';
        } else if (productPayment.metadata?.combination === 'hat_token') {
          productType = 'hat_token';
        }
        
        const realIntent = await stripeBackend.createPaymentIntent(
          productPayment.amount,
          STRIPE_CONFIG.currency,
          productType,
          productPayment.metadata
        );
        
        if (realIntent) {
          return {
            id: realIntent.id,
            amount: realIntent.amount / 100, // Convert back from cents
            currency: realIntent.currency,
            status: realIntent.status,
            client_secret: realIntent.client_secret,
          };
        }
      }

      // REAL STRIPE INTEGRATION - This will create actual payment intents in your Stripe dashboard!
      console.log('🚀 Creating REAL payment intent with Stripe...');
      console.log('📊 Product:', productPayment.productType);
      console.log('💰 Amount:', productPayment.amount);
      console.log('🏷️ Product ID:', productPayment.productId);
      console.log('📝 Metadata:', productPayment.metadata);
      
      const response = await fetch(`${STRIPE_API.baseUrl}${STRIPE_API.createPaymentIntent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(productPayment.amount * 100), // Convert to cents
          currency: STRIPE_CONFIG.currency,
          payment_method_types: STRIPE_CONFIG.supportedPaymentMethods,
          metadata: {
            product_id: productPayment.productId,
            product_type: productPayment.productType,
            ...productPayment.metadata,
          },
          description: `Payment for ${productPayment.productType === 'hat' ? 'Hat' : 'Custom Token'}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      Alert.alert('Error', 'Failed to create payment intent. Please try again.');
      return null;
    }
  }

  /**
   * Create a payment intent for hat + token combination
   */
  async createHatTokenPaymentIntent(hatPrice: number, tokenPrice: number = 0): Promise<PaymentIntent | null> {
    const totalAmount = hatPrice + tokenPrice;
    
    return this.createProductPaymentIntent({
      productId: STRIPE_CONFIG.products.hat,
      productType: 'hat',
      amount: totalAmount,
      metadata: {
        hat_price: hatPrice.toString(),
        token_price: tokenPrice.toString(),
        combination: 'hat_token',
      },
    });
  }

  /**
   * Create a payment intent for hat only
   */
  async createHatPaymentIntent(hatPrice: number): Promise<PaymentIntent | null> {
    return this.createProductPaymentIntent({
      productId: STRIPE_CONFIG.products.hat,
      productType: 'hat',
      amount: hatPrice,
      metadata: {
        hat_price: hatPrice.toString(),
        combination: 'hat_only',
      },
    });
  }

  /**
   * Create a payment intent for custom token only
   */
  async createTokenPaymentIntent(tokenPrice: number): Promise<PaymentIntent | null> {
    return this.createProductPaymentIntent({
      productId: STRIPE_CONFIG.products.customToken,
      productType: 'customToken',
      amount: tokenPrice,
      metadata: {
        token_price: tokenPrice.toString(),
        combination: 'token_only',
      },
    });
  }

  /**
   * Legacy method for backward compatibility
   */
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent | null> {
    return this.createProductPaymentIntent({
      productId: STRIPE_CONFIG.products.hat,
      productType: 'hat',
      amount,
      metadata: {
        legacy_payment: 'true',
      },
    });
  }

  /**
   * Confirm a payment with Stripe
   */
  async confirmPayment(
    clientSecret: string,
    paymentMethodId: string,
    paymentMethodType: PaymentMethodType
  ): Promise<PaymentResult> {
    try {
      if (this.useMockBackend) {
        // Use mock backend for testing
        const mockResult = await mockBackend.confirmPayment(clientSecret, paymentMethodId, paymentMethodType);
        return {
          success: mockResult.success,
          paymentIntentId: mockResult.paymentIntentId,
          error: mockResult.error,
        };
      }



      if (this.useRealStripeBackend) {
        // Use REAL Stripe backend service for payment confirmation
        console.log('🎯 Confirming payment with REAL Stripe backend...');
        
        const realResult = await stripeBackend.confirmPayment(clientSecret, paymentMethodId, paymentMethodType);
        return {
          success: realResult.success,
          paymentIntentId: realResult.paymentIntentId,
          error: realResult.error,
        };
      }

      // REAL STRIPE PAYMENT CONFIRMATION
      console.log('✅ Confirming REAL payment with Stripe...');
      console.log('🔑 Client Secret:', clientSecret.substring(0, 20) + '...');
      console.log('💳 Payment Method:', paymentMethodId);
      console.log('📱 Payment Type:', paymentMethodType);
      
      const response = await fetch(`${STRIPE_API.baseUrl}${STRIPE_API.confirmPayment}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_secret: clientSecret,
          payment_method_id: paymentMethodId,
          payment_method_type: paymentMethodType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          paymentIntentId: data.paymentIntentId,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Payment failed',
        };
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  /**
   * Validate payment amount
   */
  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 999999.99;
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  /**
   * Get test card information for sandbox testing
   */
  getTestCardInfo(): { number: string; expMonth: number; expYear: number; cvc: string } {
    return {
      number: STRIPE_CONFIG.testCards.visa,
      expMonth: 12,
      expYear: 2025,
      cvc: '123',
    };
  }

  /**
   * Check if Apple Pay is available
   */
  async isApplePayAvailable(): Promise<boolean> {
    // This will be implemented with the actual Stripe SDK
    // For now, return true for iOS devices
    return true;
  }

  /**
   * Check if Google Pay is available
   */
  async isGooglePayAvailable(): Promise<boolean> {
    // This will be implemented with the actual Stripe SDK
    // For now, return true for Android devices
    return true;
  }

  /**
   * Toggle between mock and real backend
   */
  setUseMockBackend(useMock: boolean): void {
    this.useMockBackend = useMock;
  }

  /**
   * Get current backend mode
   */
  isUsingMockBackend(): boolean {
    return this.useMockBackend;
  }

  /**
   * Get Stripe configuration status
   */
  getStripeConfigStatus() {
    return {
      publishableKey: STRIPE_CONFIG.publishableKey,
      isTestMode: STRIPE_CONFIG.publishableKey.startsWith('pk_test_'),
      isValid: STRIPE_CONFIG.publishableKey.length > 50,
      merchantIdentifier: STRIPE_CONFIG.merchantIdentifier,
      googlePayMerchantId: STRIPE_CONFIG.googlePayMerchantId,
      products: STRIPE_CONFIG.products,
      backendMode: this.useRealStripeBackend ? 'Real Stripe Backend' : 
                   this.useMockBackend ? 'Mock Backend' : 'Unknown',
      realIntegration: this.useRealStripeBackend,
    };
  }

  /**
   * Get product information
   */
  getProductInfo(productType: 'hat' | 'customToken') {
    return {
      productId: STRIPE_CONFIG.products[productType],
      productType,
      name: productType === 'hat' ? 'Hat' : 'Custom Token',
    };
  }

  /**
   * Process Google Pay payment
   */
  async processGooglePayPayment(
    amount: number,
    description: string,
    options?: { receiptEmail?: string; savePaymentMethod?: boolean }
  ): Promise<PaymentResult> {
    try {
      console.log('💳 Processing Google Pay payment...');
      console.log('💰 Amount:', amount);
      console.log('📝 Description:', description);
      
      // Create payment intent first
      const paymentIntent = await this.createProductPaymentIntent({
        productId: STRIPE_CONFIG.products.hat,
        productType: 'hat',
        amount,
        metadata: {
          payment_method: 'google_pay',
          description,
          receipt_email: options?.receiptEmail || '',
          save_payment_method: options?.savePaymentMethod ? 'true' : 'false',
        },
      });

      if (!paymentIntent) {
        return {
          success: false,
          error: 'Failed to create payment intent',
        };
      }

      // In a real implementation, you would use the Stripe SDK to show Google Pay
      // For now, we'll simulate the flow
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time

      // Simulate success (in real app, this would be handled by Stripe SDK)
      return await this.confirmPayment(
        paymentIntent.client_secret,
        'pm_google_pay_mock',
        'google_pay' as PaymentMethodType
      );
    } catch (error) {
      console.error('Google Pay processing error:', error);
      return {
        success: false,
        error: 'Google Pay payment failed',
      };
    }
  }

  /**
   * Process Apple Pay payment
   */
  async processApplePayPayment(
    amount: number,
    description: string,
    options?: { receiptEmail?: string; savePaymentMethod?: boolean }
  ): Promise<PaymentResult> {
    try {
      console.log('🍎 Processing Apple Pay payment...');
      console.log('💰 Amount:', amount);
      console.log('📝 Description:', description);
      
      // Create payment intent first
      const paymentIntent = await this.createProductPaymentIntent({
        productId: STRIPE_CONFIG.products.hat,
        productType: 'hat',
        amount,
        metadata: {
          payment_method: 'apple_pay',
          description,
          receipt_email: options?.receiptEmail || '',
          save_payment_method: options?.savePaymentMethod ? 'true' : 'false',
        },
      });

      if (!paymentIntent) {
        return {
          success: false,
          error: 'Failed to create payment intent',
        };
      }

      // In a real implementation, you would use the Stripe SDK to show Apple Pay
      // For now, we'll simulate the flow
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time

      // Simulate success (in real app, this would be handled by Stripe SDK)
      return await this.confirmPayment(
        paymentIntent.client_secret,
        'pm_apple_pay_mock',
        'apple_pay' as PaymentMethodType
      );
    } catch (error) {
      console.error('Apple Pay processing error:', error);
      return {
        success: false,
        error: 'Apple Pay payment failed',
      };
    }
  }

  /**
   * Add payment status listener
   */
  addPaymentStatusListener(paymentIntentId: string, listener: (status: string) => void): void {
    console.log('📡 Adding payment status listener for:', paymentIntentId);
    this.paymentStatusListeners.set(paymentIntentId, listener);
    
    // Simulate status updates for testing
    setTimeout(() => {
      const currentListener = this.paymentStatusListeners.get(paymentIntentId);
      if (currentListener) {
        currentListener('processing');
      }
    }, 1000);
  }

  /**
   * Remove payment status listener
   */
  removePaymentStatusListener(paymentIntentId: string): void {
    console.log('📡 Removing payment status listener for:', paymentIntentId);
    this.paymentStatusListeners.delete(paymentIntentId);
  }

  /**
   * Notify payment status listeners
   */
  private notifyPaymentStatusListeners(paymentIntentId: string, status: string): void {
    const listener = this.paymentStatusListeners.get(paymentIntentId);
    if (listener) {
      listener(status);
    }
  }

  /**
   * Create card payment method
   */
  async createCardPaymentMethod(cardDetails: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
    billingDetails?: {
      name?: string;
      email?: string;
      address?: {
        line1?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
      };
    };
  }): Promise<PaymentMethod | null> {
    try {
      console.log('💳 Creating card payment method...');
      console.log('📅 Expiry:', `${cardDetails.expMonth}/${cardDetails.expYear}`);
      console.log('👤 Cardholder:', cardDetails.billingDetails?.name || 'N/A');

      // In a real implementation, you would use Stripe's createPaymentMethod
      // For now, we'll create a mock payment method
      const mockPaymentMethod: PaymentMethod = {
        id: `pm_card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'card' as PaymentMethodType,
        card: {
          brand: this.getCardBrand(cardDetails.number),
          last4: cardDetails.number.slice(-4),
        },
      };

      console.log('✅ Card payment method created:', mockPaymentMethod.id);
      return mockPaymentMethod;
    } catch (error) {
      console.error('Error creating card payment method:', error);
      return null;
    }
  }

  /**
   * Get card brand from card number
   */
  private getCardBrand(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');
    
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || (number >= '2221' && number <= '2720')) return 'mastercard';
    if (number.startsWith('34') || number.startsWith('37')) return 'amex';
    if (number.startsWith('6011') || number.startsWith('65')) return 'discover';
    
    return 'unknown';
  }
}

export default PaymentService.getInstance();
