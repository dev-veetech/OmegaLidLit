import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PaymentMethodSelector } from '../components/payment/PaymentMethodSelector';
import { CardInputForm } from '../components/payment/CardInputForm';
import { SecureCardInputForm } from '../components/payment/SecureCardInputForm';
import { PAYMENT_METHODS, PaymentMethodType, STRIPE_CONFIG } from '../config/stripe';
import EnhancedPaymentService from '../services/paymentService';
import { FONTS } from '../config/fonts';

const { width, height } = Dimensions.get('window');

interface CheckoutScreenProps {
  route: {
    params: {
      amount: number;
      productType: 'hat' | 'customToken' | 'hatTokenCombo';
      productId: string;
      description?: string;
      metadata?: Record<string, string>;
    };
  };
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  
  // Safety check for route.params
  if (!route.params) {
    console.error('❌ CheckoutScreen: route.params is undefined');
    // Navigate back to prevent crash
    navigation.goBack();
    return null;
  }
  
  const { amount, productType, productId, description, metadata } = route.params;
  
  // Additional safety checks for required params
  if (!amount || !productType || !productId) {
    console.error('❌ CheckoutScreen: Missing required params:', { amount, productType, productId });
    navigation.goBack();
    return null;
  }
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | undefined>();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);

  // Get product information
  const productInfo = EnhancedPaymentService.getProductInfo(productType);
  const formattedAmount = EnhancedPaymentService.formatAmount(amount);

  useEffect(() => {
    // Set up payment status listener if we have a payment intent
    if (paymentIntentId) {
      const statusListener = (status: string) => {
        console.log('Payment status updated:', status);
        if (status === 'succeeded') {
          setPaymentStatus('success');
        } else if (status === 'failed') {
          setPaymentStatus('failed');
        }
      };

      EnhancedPaymentService.addPaymentStatusListener(paymentIntentId, statusListener);

      return () => {
        EnhancedPaymentService.removePaymentStatusListener(paymentIntentId);
      };
    }
  }, [paymentIntentId]);

  const handlePaymentMethodSelect = useCallback((method: PaymentMethodType) => {
    setSelectedPaymentMethod(method);
  }, []);

  const handleCardPaymentSuccess = useCallback((result: any) => {
    setPaymentStatus('success');
    setPaymentIntentId(result.paymentIntentId || null);
    setShowCardForm(false);
    
    // Navigate to success screen
    setTimeout(() => {
      navigation.navigate('OrderConfirmation' as never);
    }, 1500);
  }, [navigation]);

  const handleCardPaymentError = useCallback((error: string) => {
    setPaymentStatus('failed');
    setIsProcessingPayment(false);
    console.error('Card payment error:', error);
  }, []);

  const handleCardPaymentStart = useCallback(() => {
    setPaymentStatus('processing');
  }, []);

  const processPayment = useCallback(async (method: PaymentMethodType): Promise<void> => {
    try {
      setIsProcessingPayment(true);
      
      // Don't set payment status to 'processing' for card payments yet
      if (method !== PAYMENT_METHODS.CARD) {
        setPaymentStatus('processing');
      }

      console.log('🚀 Starting payment process...');
      console.log('💰 Amount:', amount);
      console.log('🏷️ Product Type:', productType);
      console.log('💳 Payment Method:', method);

      let paymentResult;

      // Handle different payment methods
      if (method === PAYMENT_METHODS.APPLE_PAY) {
        paymentResult = await EnhancedPaymentService.processApplePayPayment(
          amount,
          description || `Payment for ${productInfo.name}`,
          {
            receiptEmail: 'customer@example.com', // You can get this from user profile
            savePaymentMethod: true,
          }
        );
      } else if (method === PAYMENT_METHODS.GOOGLE_PAY) {
        paymentResult = await EnhancedPaymentService.processGooglePayPayment(
          amount,
          description || `Payment for ${productInfo.name}`,
          {
            receiptEmail: 'customer@example.com', // You can get this from user profile
            savePaymentMethod: true,
          }
        );
      } else {
        // For card payments, show the card input form
        console.log('🔄 Card payment selected, showing card form...');
        console.log('📱 Payment method:', method);
        console.log('💳 Expected card method:', PAYMENT_METHODS.CARD);
        setSelectedPaymentMethod(method);
        setShowCardForm(true);
        setIsProcessingPayment(false);
        return; // Don't continue with payment processing here
      }

      if (paymentResult.success) {
        setPaymentStatus('success');
        setPaymentIntentId(paymentResult.paymentIntentId || null);
        
        // Navigate to success screen
        setTimeout(() => {
          navigation.navigate('OrderConfirmation' as never);
        }, 1500);
      } else {
        setPaymentStatus('failed');
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentStatus('failed');
      
      Alert.alert(
        'Payment Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred',
        [
          { text: 'Try Again', onPress: () => setPaymentStatus('idle') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setIsProcessingPayment(false);
    }
  }, [amount, productType, productId, description, metadata, navigation, productInfo.name]);

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <View style={styles.statusContainer}>
            <LinearGradient
              colors={['#007AFF', '#0056CC']}
              style={styles.statusGradient}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.statusText}>Processing Payment...</Text>
              <Text style={styles.statusSubtext}>Please wait while we complete your transaction</Text>
            </LinearGradient>
          </View>
        );
      
      case 'success':
        return (
          <View style={styles.statusContainer}>
            <LinearGradient
              colors={['#34C759', '#28A745']}
              style={styles.statusGradient}
            >
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.statusText}>Payment Successful!</Text>
              <Text style={styles.statusSubtext}>Redirecting to confirmation...</Text>
            </LinearGradient>
          </View>
        );
      
      case 'failed':
        return (
          <View style={styles.statusContainer}>
            <LinearGradient
              colors={['#FF3B30', '#DC3545']}
              style={styles.statusGradient}
            >
              <Text style={styles.errorIcon}>❌</Text>
              <Text style={styles.statusText}>Payment Failed</Text>
              <Text style={styles.statusSubtext}>Please try again or use a different payment method</Text>
            </LinearGradient>
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderOrderSummary = () => (
    <View style={styles.orderSummaryContainer}>
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF']}
        style={styles.orderSummaryGradient}
      >
        <Text style={styles.orderSummaryTitle}>Order Summary</Text>
        
        <View style={styles.orderItem}>
          <Text style={styles.orderItemLabel}>{productInfo.name}</Text>
          <Text style={styles.orderItemValue}>{formattedAmount}</Text>
        </View>
        
        {productType === 'hatTokenCombo' && (
          <>
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Hat</Text>
              <Text style={styles.orderItemValue}>$25.99</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>AI Token</Text>
              <Text style={styles.orderItemValue}>$15.99</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Combo Discount</Text>
              <Text style={styles.orderItemValue}>-$5.99</Text>
            </View>
          </>
        )}
        
        <View style={styles.orderDivider} />
        
        <View style={styles.orderTotal}>
          <Text style={styles.orderTotalLabel}>Total</Text>
          <Text style={styles.orderTotalValue}>{formattedAmount}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  if (paymentStatus === 'processing' || paymentStatus === 'success' || paymentStatus === 'failed') {
    return (
      <SafeAreaView style={styles.container}>
        {renderPaymentStatus()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>Complete your purchase securely</Text>
        </View>

        {/* Order Summary */}
        {renderOrderSummary()}

        {/* Payment Method Selection */}
        {!showCardForm && (
          <PaymentMethodSelector
            onPaymentMethodSelect={handlePaymentMethodSelect}
            selectedMethod={selectedPaymentMethod}
            amount={amount}
            onPaymentProcess={processPayment}
            disabled={isProcessingPayment}
          />
        )}

        {/* Secure Card Input Form */}
        {showCardForm && (
          <SecureCardInputForm
            amount={amount}
            productId={productId}
            productType={productType}
            description={description || `Payment for ${productInfo.name}`}
            metadata={{
              ...metadata,
              user_id: 'user_123', // You can get this from user context
            }}
            onPaymentSuccess={handleCardPaymentSuccess}
            onPaymentError={handleCardPaymentError}
            onPaymentStart={handleCardPaymentStart}
          />
        )}

        {/* Security Information */}
        <View style={styles.securityContainer}>
          <LinearGradient
            colors={['#F8F9FA', '#E9ECEF']}
            style={styles.securityGradient}
          >
            <Text style={styles.securityTitle}>🔒 Secure Payment</Text>
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We use industry-standard 
              SSL encryption to protect your data.
            </Text>
            
            <View style={styles.securityFeatures}>
              <Text style={styles.securityFeature}>✓ PCI DSS Compliant</Text>
              <Text style={styles.securityFeature}>✓ 256-bit SSL Encryption</Text>
              <Text style={styles.securityFeature}>✓ Stripe Security Standards</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Test Mode Notice */}
        {STRIPE_CONFIG.publishableKey.startsWith('pk_test_') && (
          <View style={styles.testModeContainer}>
            <Text style={styles.testModeText}>
              🧪 Test Mode: Use test card numbers for testing
            </Text>
            <Text style={styles.testCardInfo}>
              Visa: 4242 4242 4242 4242{'\n'}
              Mastercard: 5555 5555 5555 4444{'\n'}
              Amex: 3782 822463 10005
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: FONTS.ROCK_SALT,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  orderSummaryContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  orderSummaryGradient: {
    padding: 20,
  },
  orderSummaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderItemLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  orderItemValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  orderDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 16,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderTotalLabel: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  orderTotalValue: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '700',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  statusGradient: {
    width: '100%',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  securityContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  securityGradient: {
    padding: 20,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  securityFeatures: {
    gap: 8,
  },
  securityFeature: {
    fontSize: 13,
    color: '#28A745',
    fontWeight: '500',
  },
  testModeContainer: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  testModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
    textAlign: 'center',
  },
  testCardInfo: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'monospace',
  },
});
