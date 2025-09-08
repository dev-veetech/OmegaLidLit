import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PAYMENT_METHODS } from '../../config/stripe';
import EnhancedPaymentService from '../../services/paymentService';
import { FONTS } from '../../config/fonts';

interface CardInputFormProps {
  amount: number;
  productId?: string;
  productType?: 'hat' | 'customToken';
  description?: string;
  metadata?: Record<string, string>;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
  onPaymentStart?: () => void;
}

export const CardInputForm: React.FC<CardInputFormProps> = ({
  amount,
  productId = 'test_card_payment',
  productType = 'customToken',
  description = 'Card Payment',
  metadata = {},
  onPaymentSuccess,
  onPaymentError,
  onPaymentStart,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiry = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number');
      return false;
    }
    
    // Validate expiry date (MM/YY format)
    if (!expMonth || !expMonth.match(/^\d{2}\/\d{2}$/)) {
      Alert.alert('Invalid Expiry', 'Please enter card expiry date in MM/YY format');
      return false;
    }
    
    // Check if expiry date is in the future
    const [month, year] = expMonth.split('/');
    const expMonthNum = parseInt(month, 10);
    const expYearNum = parseInt('20' + year, 10);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    if (expYearNum < currentYear || (expYearNum === currentYear && expMonthNum < currentMonth)) {
      Alert.alert('Invalid Expiry', 'Please enter a future expiry date');
      return false;
    }
    
    if (expMonthNum < 1 || expMonthNum > 12) {
      Alert.alert('Invalid Expiry', 'Please enter a valid month (01-12)');
      return false;
    }
    if (!cvc.match(/^\d{3,4}$/)) {
      Alert.alert('Invalid CVC', 'Please enter a valid 3 or 4 digit CVC');
      return false;
    }
    if (!cardholderName.trim()) {
      Alert.alert('Missing Name', 'Please enter the cardholder name');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    try {
      setIsProcessing(true);
      
      // Notify parent that payment processing has started
      onPaymentStart?.();

      // Parse expiry date
      const [month, year] = expMonth.split('/');
      const expMonthNum = parseInt(month, 10);
      const expYearNum = parseInt('20' + year, 10);

      // Create payment intent first
      console.log('💰 Creating payment intent...');
      const paymentIntent = await EnhancedPaymentService.createProductPaymentIntent({
        productId,
        productType,
        amount: amount,
        description,
        metadata: {
          payment_method: 'card',
          cardholder_name: cardholderName.trim(),
          ...metadata,
        },
      }, {
        savePaymentMethod: true,
        setupFutureUsage: 'off_session',
      });

      if (!paymentIntent) {
        throw new Error('Failed to create payment intent');
      }

      console.log('✅ Payment intent created:', paymentIntent.id);

      // Confirm payment with card details via backend
      console.log('💳 Confirming payment with card details...');
      const confirmResponse = await fetch('http://192.168.100.18:3005/api/confirm-payment-with-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntent.id,
          card_number: cardNumber.replace(/\s/g, ''),
          exp_month: expMonthNum,
          exp_year: expYearNum,
          cvc: cvc,
          cardholder_name: cardholderName.trim(),
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error(`Payment confirmation failed: ${confirmResponse.status}`);
      }

      const result = await confirmResponse.json();

      if (result.success) {
        onPaymentSuccess(result);
        Alert.alert(
          'Payment Successful! 🎉',
          `Payment completed successfully!\n\nPayment ID: ${result.paymentIntentId}\nAmount: $${amount.toFixed(2)}`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(result.error || 'Payment failed');
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
    setCardNumber('4242 4242 4242 4242');
    setExpMonth('12/25');
    setCvc('123');
    setCardholderName('Test User');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Card Details</Text>
      <Text style={styles.subtitle}>Complete your payment securely</Text>

      {/* Test Card Button */}
      <TouchableOpacity style={styles.testCardButton} onPress={useTestCard}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.testCardButtonGradient}
        >
          <Text style={styles.testCardButtonText}>🧪 Use Test Card</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Card Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
          autoComplete="cc-number"
        />
      </View>

      {/* Expiry and CVC Row */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            value={expMonth}
            onChangeText={(text) => setExpMonth(formatExpiry(text))}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            autoComplete="cc-exp"
          />
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>CVC</Text>
          <TextInput
            style={styles.input}
            value={cvc}
            onChangeText={setCvc}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            autoComplete="cc-csc"
          />
        </View>
      </View>

      {/* Cardholder Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          value={cardholderName}
          onChangeText={setCardholderName}
          placeholder="John Doe"
          autoComplete="cc-name"
          autoCapitalize="words"
        />
      </View>

      {/* Payment Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        <LinearGradient
          colors={['#007AFF', '#0056CC']}
          style={styles.payButtonGradient}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay ${amount.toFixed(2)}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityText}>
          🔒 Your payment information is secure and encrypted
        </Text>
        <Text style={styles.securitySubtext}>
          We use Stripe for secure payment processing
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
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#1A1A1A',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  payButton: {
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
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
    color: '#28A745',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  securitySubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

