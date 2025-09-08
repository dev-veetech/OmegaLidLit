import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import EnhancedPaymentService from '../../services/paymentService';
import { FONTS } from '../../config/fonts';

interface SecureCardInputFormProps {
  amount: number;
  productId?: string;
  productType?: 'hat' | 'customToken';
  description?: string;
  metadata?: Record<string, string>;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
  onPaymentStart?: () => void;
}

export const SecureCardInputForm: React.FC<SecureCardInputFormProps> = ({
  amount,
  productId = 'test_card_payment',
  productType = 'customToken',
  description = 'Card Payment',
  metadata = {},
  onPaymentSuccess,
  onPaymentError,
  onPaymentStart,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { createPaymentMethod, confirmPayment } = useStripe();

  const handlePayment = async () => {
    if (!cardComplete) {
      Alert.alert('Incomplete Card', 'Please enter complete card details');
      return;
    }

    try {
      setIsProcessing(true);
      onPaymentStart?.();

      console.log('🔐 Creating secure payment method with Stripe...');

      // Step 1: Create payment method securely with Stripe
      const { error: paymentMethodError, paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: 'Test User', // You can make this configurable
            email: 'test@example.com',
          },
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      console.log('✅ Secure payment method created:', paymentMethod.id);

      // Step 2: Create payment intent
      console.log('💰 Creating payment intent...');
      const paymentIntent = await EnhancedPaymentService.createProductPaymentIntent({
        productId,
        productType,
        amount: amount,
        description,
        metadata: {
          payment_method: 'card_secure',
          payment_method_id: paymentMethod.id,
          ...metadata,
        },
      });

      if (!paymentIntent) {
        throw new Error('Failed to create payment intent');
      }

      console.log('✅ Payment intent created:', paymentIntent.id);

      // Step 3: Confirm payment securely with Stripe
      console.log('🔐 Confirming payment securely...');
      const { error: confirmError, paymentIntent: confirmedPaymentIntent } = await confirmPayment(
        paymentIntent.client_secret,
        {
          paymentMethodType: 'Card',
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (!confirmedPaymentIntent) {
        throw new Error('Payment confirmation failed');
      }

      console.log('✅ Payment confirmed securely:', confirmedPaymentIntent.id);
      console.log('📊 Status:', confirmedPaymentIntent.status);

      if (confirmedPaymentIntent.status === 'Succeeded') {
        onPaymentSuccess({
          success: true,
          paymentIntentId: confirmedPaymentIntent.id,
          status: confirmedPaymentIntent.status,
        });
        
        Alert.alert(
          'Payment Successful! 🎉',
          `Payment completed securely!\\n\\nPayment ID: ${confirmedPaymentIntent.id}\\nAmount: $${amount.toFixed(2)}`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(`Payment incomplete. Status: ${confirmedPaymentIntent.status}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onPaymentError(errorMessage);
      Alert.alert('Payment Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const useTestCard = () => {
    Alert.alert(
      'Test Card Info',
      'Use the test card number: 4242 4242 4242 4242\\nExpiry: Any future date\\nCVC: Any 3 digits\\n\\nThis will be processed securely through Stripe.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Card Details</Text>
      <Text style={styles.subtitle}>Processed securely with Stripe</Text>

      {/* Test Card Info Button */}
      <TouchableOpacity style={styles.testCardButton} onPress={useTestCard}>
        <LinearGradient
          colors={['#34C759', '#28A745']}
          style={styles.testCardButtonGradient}
        >
          <Text style={styles.testCardButtonText}>🛡️ Test Card Info</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Secure Stripe Card Field */}
      <View style={styles.cardFieldContainer}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
            expiry: 'MM/YY',
            cvc: 'CVC',
          }}
          cardStyle={{
            backgroundColor: '#F8F9FA',
            borderColor: cardComplete ? '#34C759' : '#E9ECEF',
            borderWidth: 2,
            borderRadius: 12,
            fontSize: 16,
            placeholderColor: '#999999',
            textColor: '#1A1A1A',
          }}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setCardComplete(cardDetails.complete);
          }}
        />
      </View>

      {/* Security Features */}
      <View style={styles.securityFeatures}>
        <Text style={styles.securityFeature}>✅ PCI DSS Compliant</Text>
        <Text style={styles.securityFeature}>✅ End-to-end Encryption</Text>
        <Text style={styles.securityFeature}>✅ No Card Data Stored</Text>
        <Text style={styles.securityFeature}>✅ Stripe Secure Elements</Text>
      </View>

      {/* Payment Button */}
      <TouchableOpacity
        style={[styles.payButton, (!cardComplete || isProcessing) && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={!cardComplete || isProcessing}
      >
        <LinearGradient
          colors={cardComplete && !isProcessing ? ['#007AFF', '#0056CC'] : ['#999', '#777']}
          style={styles.payButtonGradient}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>
              🔐 Secure Pay ${amount.toFixed(2)}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityText}>
          🔒 Your payment is processed securely by Stripe
        </Text>
        <Text style={styles.securitySubtext}>
          Card details never leave your device or touch our servers
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FONTS.ROCK_SALT,
  },
  subtitle: {
    fontSize: 16,
    color: '#34C759',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  testCardButton: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  testCardButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testCardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardFieldContainer: {
    marginBottom: 20,
  },
  cardField: {
    height: 50,
  },
  securityFeatures: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  securityFeature: {
    fontSize: 14,
    color: '#0369A1',
    marginBottom: 4,
    fontWeight: '500',
  },
  payButton: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  securityNotice: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  securityText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  securitySubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});