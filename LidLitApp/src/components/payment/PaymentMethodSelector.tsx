import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PAYMENT_METHODS, PaymentMethodType, STRIPE_CONFIG } from '../../config/stripe';
import EnhancedPaymentService from '../../services/paymentService';

const { width } = Dimensions.get('window');

interface PaymentMethodSelectorProps {
  onPaymentMethodSelect: (method: PaymentMethodType) => void;
  selectedMethod?: PaymentMethodType;
  amount: number;
  onPaymentProcess?: (method: PaymentMethodType) => Promise<void>;
  disabled?: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onPaymentMethodSelect,
  selectedMethod,
  amount,
  onPaymentProcess,
  disabled = false,
}) => {
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkPaymentMethodAvailability();
  }, []);

  const checkPaymentMethodAvailability = async () => {
    try {
      setIsCheckingAvailability(true);
      
      const [applePay, googlePay] = await Promise.all([
        EnhancedPaymentService.isApplePayAvailable(),
        EnhancedPaymentService.isGooglePayAvailable(),
      ]);
      
      setApplePayAvailable(applePay);
      setGooglePayAvailable(googlePay);
    } catch (error) {
      console.error('Error checking payment method availability:', error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handlePaymentMethodSelect = async (method: PaymentMethodType) => {
    if (disabled || isProcessing) return;

    if (method === PAYMENT_METHODS.APPLE_PAY && !applePayAvailable) {
      Alert.alert(
        'Apple Pay Unavailable', 
        'Apple Pay is not available on this device or not configured.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (method === PAYMENT_METHODS.GOOGLE_PAY && !googlePayAvailable) {
      Alert.alert(
        'Google Pay Unavailable', 
        'Google Pay is not available on this device or not configured.',
        [{ text: 'OK' }]
      );
      return;
    }

    // If we have a payment processor, use it
    if (onPaymentProcess) {
      try {
        setIsProcessing(true);
        await onPaymentProcess(method);
      } catch (error) {
        console.error('Payment processing error:', error);
        Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Otherwise, just select the method
      onPaymentMethodSelect(method);
    }
  };

  const renderPaymentMethod = (
    method: PaymentMethodType, 
    icon: any, 
    label: string, 
    available: boolean,
    description?: string
  ) => {
    const isSelected = selectedMethod === method;
    const isDisabled = !available || disabled || isProcessing;
    const isProcessingMethod = isSelected && isProcessing;

    return (
      <TouchableOpacity
        style={[
          styles.paymentMethodCard,
          isSelected && styles.selectedPaymentMethod,
          isDisabled && styles.disabledPaymentMethod,
          isProcessingMethod && styles.processingPaymentMethod,
        ]}
        onPress={() => handlePaymentMethodSelect(method)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isSelected ? ['#007AFF', '#0056CC'] : ['#F8F9FA', '#E9ECEF']}
          style={styles.paymentMethodGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.paymentMethodContent}>
            <View style={styles.paymentMethodLeft}>
              <View style={[
                styles.iconContainer,
                isSelected && styles.selectedIconContainer
              ]}>
                <Image 
                  source={icon} 
                  style={[
                    styles.paymentIcon, 
                    isSelected && styles.selectedPaymentIcon
                  ]} 
                  resizeMode="contain" 
                />
              </View>
              
              <View style={styles.paymentMethodInfo}>
                <Text style={[
                  styles.paymentMethodLabel,
                  isSelected && styles.selectedPaymentMethodLabel,
                  isDisabled && styles.disabledPaymentMethodLabel,
                ]}>
                  {label}
                </Text>
                {description && (
                  <Text style={[
                    styles.paymentMethodDescription,
                    isSelected && styles.selectedPaymentMethodDescription,
                    isDisabled && styles.disabledPaymentMethodDescription,
                  ]}>
                    {description}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.paymentMethodRight}>
              {isProcessingMethod ? (
                <View style={styles.processingIndicator}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              ) : isSelected ? (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIndicatorText}>✓</Text>
                </View>
              ) : null}
              
              {!available && (
                <Text style={styles.unavailableText}>Unavailable</Text>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (isCheckingAvailability) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Checking payment methods...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        <Text style={styles.sectionSubtitle}>Select your preferred way to pay</Text>
      </View>
      
      <View style={styles.paymentMethodsContainer}>
        {/* Apple Pay */}
        {Platform.OS === 'ios' && (
          renderPaymentMethod(
            PAYMENT_METHODS.APPLE_PAY,
            require('../../../assets/ApplePay.png'),
            'Apple Pay',
            applePayAvailable,
            'Fast and secure payment'
          )
        )}

        {/* Google Pay */}
        {Platform.OS === 'android' && (
          renderPaymentMethod(
            PAYMENT_METHODS.GOOGLE_PAY,
            require('../../../assets/GooglePay.png'),
            'Google Pay',
            googlePayAvailable,
            'Quick and easy payment'
          )
        )}

        {/* Credit/Debit Card */}
        {renderPaymentMethod(
          PAYMENT_METHODS.CARD,
          require('../../../assets/bag.png'), // Using bag icon as placeholder for card
          'Credit/Debit Card',
          true,
          'Visa, Mastercard, Amex, Discover'
        )}
      </View>

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <LinearGradient
          colors={['#F8F9FA', '#E9ECEF']}
          style={styles.amountGradient}
        >
          <View style={styles.amountContent}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>
              {EnhancedPaymentService.formatAmount(amount)}
            </Text>
          </View>
          
          {selectedMethod && (
            <View style={styles.selectedMethodInfo}>
              <Text style={styles.selectedMethodText}>
                Selected: {selectedMethod === PAYMENT_METHODS.APPLE_PAY ? 'Apple Pay' :
                          selectedMethod === PAYMENT_METHODS.GOOGLE_PAY ? 'Google Pay' :
                          'Credit/Debit Card'}
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityText}>
          🔒 Your payment information is secure and encrypted
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  paymentMethodsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  paymentMethodCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  paymentMethodGradient: {
    padding: 20,
  },
  selectedPaymentMethod: {
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  disabledPaymentMethod: {
    opacity: 0.6,
  },
  processingPaymentMethod: {
    elevation: 6,
    shadowOpacity: 0.3,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  paymentIcon: {
    width: 28,
    height: 28,
    tintColor: '#007AFF',
  },
  selectedPaymentIcon: {
    tintColor: '#FFFFFF',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  selectedPaymentMethodLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  disabledPaymentMethodLabel: {
    color: '#999',
  },
  paymentMethodDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  selectedPaymentMethodDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  disabledPaymentMethodDescription: {
    color: '#BBB',
  },
  paymentMethodRight: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '500',
  },
  unavailableText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
  amountContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  amountGradient: {
    padding: 20,
  },
  amountContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  selectedMethodInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectedMethodText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  securityNotice: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  securityText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
