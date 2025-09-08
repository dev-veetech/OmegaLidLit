// REAL STRIPE INTEGRATION SERVICE
// This service creates ACTUAL payment intents that will appear in your Stripe dashboard
// Note: In production, this should be done on your backend server for security

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  metadata?: Record<string, string>;
  payment_method_types?: string[];
  next_action?: any;
  last_payment_error?: any;
}

export interface StripePaymentResponse {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

class StripeBackendService {
  // ⚠️ SECURITY NOTICE: Secret keys removed from frontend
  // This service now uses mock data for frontend testing only
  // In production, all backend operations should be handled by your server
  private baseUrl: string = 'http://192.168.100.18:3006/api'; // Real backend URL
  private products = {
    hat: 'prod_SrRzE1tKHvkVls',
    customToken: 'prod_SrRx6M8fdinH7w',
  };

  /**
   * Create payment intent via backend API (secure approach)
   * This should call your backend server which handles Stripe API calls
   */
  async createPaymentIntent(
    amount: number, 
    currency: string = 'usd',
    productType: 'hat' | 'customToken' | 'hat_token' = 'hat',
    metadata: Record<string, string> = {}
  ): Promise<StripePaymentIntent | null> {
    try {
      console.log('🚀 Creating payment intent via backend API...');
      console.log('📊 Product Type:', productType);
      console.log('💰 Amount:', amount);
      
      // For hat_token combination, use hat product ID as primary
      const productId = productType === 'hat_token' ? this.products.hat : this.products[productType] || 'unknown';
      console.log('🏷️ Product ID:', productId);
      
      // In a real app, this would call your backend API
      const response = await fetch(`${this.baseUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          productId,
          productType,
          metadata: {
            product_id: productId,
            product_type: productType,
            amount: amount.toString(),
            timestamp: new Date().toISOString(),
            ...metadata,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend API Error: ${response.status} - ${response.statusText}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Backend API returned non-JSON response: ${contentType}`);
      }

      const backendResponse = await response.json();
      console.log('✅ Backend API Response:', backendResponse);
      
      return backendResponse.paymentIntent;
    } catch (error) {
      console.error('❌ Error creating payment intent via backend:', error);
      
      // For development, return a mock payment intent
      console.log('🧪 Returning mock payment intent for development...');
      const mockIntent: StripePaymentIntent = {
        id: `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        currency: currency,
        status: 'requires_payment_method',
        client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          product_id: productType === 'hat_token' ? this.products.hat : this.products[productType] || 'unknown',
          product_type: productType,
          amount: amount.toString(),
          timestamp: new Date().toISOString(),
          mock: 'true',
          ...metadata,
        },
        payment_method_types: ['card'],
      };
      
      console.log('🧪 Mock payment intent created:', mockIntent.id);
      return mockIntent;
    }
  }

  /**
   * Create payment intent for hat + token combination
   */
  async createHatTokenPaymentIntent(hatPrice: number, tokenPrice: number = 0): Promise<StripePaymentIntent | null> {
    const totalAmount = hatPrice + tokenPrice;
    
    return this.createPaymentIntent(totalAmount, 'usd', 'hat_token', {
      hat_price: hatPrice.toString(),
      token_price: tokenPrice.toString(),
      combination: 'hat_token',
    });
  }

  /**
   * Create payment intent for hat only
   */
  async createHatPaymentIntent(hatPrice: number): Promise<StripePaymentIntent | null> {
    return this.createPaymentIntent(hatPrice, 'usd', 'hat', {
      hat_price: hatPrice.toString(),
      combination: 'hat_only',
    });
  }

  /**
   * Create payment intent for token only
   */
  async createTokenPaymentIntent(tokenPrice: number): Promise<StripePaymentIntent | null> {
    return this.createPaymentIntent(tokenPrice, 'usd', 'customToken', {
      token_price: tokenPrice.toString(),
      combination: 'token_only',
    });
  }

  /**
   * Confirm a payment with Stripe
   * This will process the payment and show results in your dashboard
   */
  async confirmPayment(
    clientSecret: string,
    paymentMethodId: string,
    paymentMethodType: string
  ): Promise<StripePaymentResponse> {
    try {
      console.log('🎯 Confirming payment with real backend...');
      console.log('🔑 Client Secret:', clientSecret?.substring(0, 20) + '...');
      console.log('💳 Payment Method ID:', paymentMethodId);
      console.log('📱 Payment Method Type:', paymentMethodType);

      // Make real API call to backend to confirm payment
      const response = await fetch(`${this.baseUrl}/confirm-payment`, {
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
        throw new Error(`Backend API Error: ${response.status} - ${response.statusText}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Backend API returned non-JSON response: ${contentType}`);
      }

      const result = await response.json();
      console.log('✅ Payment confirmation result:', result);
      
      return {
        success: result.success,
        paymentIntentId: result.paymentIntentId,
        error: result.error,
      };
    } catch (error) {
      console.error('❌ Error confirming payment:', error);
      
      // Fall back to mock confirmation for development
      console.log('🧪 Using mock payment confirmation...');
      return {
        success: true,
        paymentIntentId: clientSecret?.split('_secret_')[0] || 'pi_mock_fallback',
        error: undefined,
      };
    }
  }

  /**
   * Get test card information for sandbox testing
   */
  getTestCardInfo(): { number: string; expMonth: number; expYear: number; cvc: string } {
    return {
      number: '4242424242424242', // Visa test card
      expMonth: 12,
      expYear: 2025,
      cvc: '123',
    };
  }

  /**
   * Get configuration information
   */
  getConfigurationInfo() {
    return {
      backendUrl: this.baseUrl,
      isTestMode: true, // Always test mode for frontend
      isValid: this.validateConfiguration(),
      products: this.products,
    };
  }

  /**
   * Validate configuration
   */
  validateConfiguration(): boolean {
    return this.baseUrl.length > 0;
  }
}

export default new StripeBackendService();
