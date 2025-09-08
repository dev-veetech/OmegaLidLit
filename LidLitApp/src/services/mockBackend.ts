// Mock Backend Service for Stripe Integration Testing
// In production, this would be replaced with real API calls to your backend

export interface MockPaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface MockPaymentResponse {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

class MockBackendService {
  private paymentIntents: Map<string, MockPaymentIntent> = new Map();

  /**
   * Create a mock payment intent
   */
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<MockPaymentIntent> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const paymentIntent: MockPaymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.paymentIntents.set(paymentIntent.id, paymentIntent);
    
    return paymentIntent;
  }

  /**
   * Confirm a mock payment
   */
  async confirmPayment(
    clientSecret: string,
    paymentMethodId: string,
    paymentMethodType: string
  ): Promise<MockPaymentResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate payment success/failure (90% success rate for testing)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      // Find the payment intent by client secret
      let paymentIntentId: string | undefined;
      for (const [id, intent] of this.paymentIntents.entries()) {
        if (intent.client_secret === clientSecret) {
          paymentIntentId = id;
          break;
        }
      }

      if (paymentIntentId) {
        // Update payment intent status
        const intent = this.paymentIntents.get(paymentIntentId);
        if (intent) {
          intent.status = 'succeeded';
          this.paymentIntents.set(paymentIntentId, intent);
        }
      }

      return {
        success: true,
        paymentIntentId,
      };
    } else {
      return {
        success: false,
        error: 'Payment was declined. Please try a different payment method.',
      };
    }
  }

  /**
   * Get payment intent by ID
   */
  async getPaymentIntent(id: string): Promise<MockPaymentIntent | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.paymentIntents.get(id) || null;
  }

  /**
   * Simulate webhook events
   */
  async simulateWebhookEvent(eventType: string, paymentIntentId: string): Promise<void> {
    console.log(`Webhook event: ${eventType} for payment intent: ${paymentIntentId}`);
    
    // In a real implementation, this would send webhook events to your backend
    // For now, we'll just log the event
  }
}

export default new MockBackendService();

