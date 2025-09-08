import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { PaymentMethodSelector } from '../components/payment/PaymentMethodSelector';
import { CardInputForm } from '../components/payment/CardInputForm';
import { PAYMENT_METHODS, PaymentMethodType, STRIPE_CONFIG } from '../config/stripe';
import EnhancedPaymentService from '../services/paymentService';
import { FONTS } from '../config/fonts';

export const StripeTestScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [showCardForm, setShowCardForm] = useState(false);

  const testAmount = 15.99; // Test with AI token price

  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = async () => {
    try {
      const status = EnhancedPaymentService.getStripeConfigStatus();
      setStripeStatus(status);
      console.log('Stripe Status:', status);
    } catch (error) {
      console.error('Error checking Stripe status:', error);
    }
  };

  const addTestResult = (test: string, result: 'success' | 'error', details: string) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      result,
      details,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const testPaymentIntentCreation = async () => {
    try {
      addTestResult('Payment Intent Creation', 'success', 'Starting test...');
      
      console.log('🧪 Starting payment intent creation test...');
      console.log('💰 Test Amount:', testAmount);
      console.log('🏷️ Product Type: customToken');
      console.log('🔑 Using backend:', EnhancedPaymentService.isUsingMockBackend() ? 'Mock' : 'Real Stripe');
      
      const paymentIntent = await EnhancedPaymentService.createProductPaymentIntent({
        productId: 'prod_SrRx6M8fdinH7w', // Use the actual product ID from your config
        productType: 'customToken',
        amount: testAmount,
        description: 'Test AI Token Generation',
        metadata: { test: 'true', timestamp: new Date().toISOString() },
      });

      console.log('📊 Payment Intent Result:', paymentIntent);

      if (paymentIntent) {
        addTestResult('Payment Intent Creation', 'success', 
          `Created: ${paymentIntent.id} - Status: ${paymentIntent.status} - Client Secret: ${paymentIntent.client_secret?.substring(0, 20)}...`);
        
        console.log('✅ Payment Intent Created Successfully!');
        console.log('🆔 ID:', paymentIntent.id);
        console.log('📊 Status:', paymentIntent.status);
        console.log('🔐 Client Secret Length:', paymentIntent.client_secret?.length);
        
        return paymentIntent;
      } else {
        addTestResult('Payment Intent Creation', 'error', 'Failed to create payment intent');
        console.log('❌ Payment Intent Creation Failed - No result returned');
        return null;
      }
    } catch (error) {
      console.error('💥 Payment Intent Creation Error:', error);
      addTestResult('Payment Intent Creation', 'error', 
        error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  };

  const testApplePay = async () => {
    try {
      addTestResult('Apple Pay Test', 'success', 'Testing Apple Pay availability...');
      
      const isAvailable = await EnhancedPaymentService.isApplePayAvailable();
      
      if (isAvailable) {
        addTestResult('Apple Pay Test', 'success', 'Apple Pay is available on this device');
      } else {
        addTestResult('Apple Pay Test', 'error', 'Apple Pay is not available on this device');
      }
      
      return isAvailable;
    } catch (error) {
      addTestResult('Apple Pay Test', 'error', 
        error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  };

  const testGooglePay = async () => {
    try {
      addTestResult('Google Pay Test', 'success', 'Testing Google Pay availability...');
      
      const isAvailable = await EnhancedPaymentService.isGooglePayAvailable();
      
      if (isAvailable) {
        addTestResult('Google Pay Test', 'success', 'Google Pay is available on this device');
      } else {
        addTestResult('Google Pay Test', 'error', 'Google Pay is not available on this device');
      }
      
      return isAvailable;
    } catch (error) {
      addTestResult('Google Pay Test', 'error', 
        error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  };

  const testFullPaymentFlow = async () => {
    try {
      setIsProcessing(true);
      addTestResult('Full Payment Flow', 'success', 'Starting complete payment test...');

      // Step 1: Create payment intent
      const paymentIntent = await testPaymentIntentCreation();
      if (!paymentIntent) {
        addTestResult('Full Payment Flow', 'error', 'Failed at payment intent creation');
        return;
      }

      // Step 2: Test payment confirmation (mock)
      const confirmResult = await EnhancedPaymentService.confirmPayment(
        paymentIntent.client_secret,
        'pm_test_payment_method',
        PAYMENT_METHODS.CARD
      );

      if (confirmResult.success) {
        addTestResult('Full Payment Flow', 'success', 
          `Payment confirmed: ${confirmResult.paymentIntentId}`);
      } else {
        addTestResult('Full Payment Flow', 'error', 
          `Payment confirmation failed: ${confirmResult.error}`);
      }

    } catch (error) {
      addTestResult('Full Payment Flow', 'error', 
        error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    
    // Test payment method availability
    await testApplePay();
    await testGooglePay();
    
    // Test payment intent creation
    await testPaymentIntentCreation();
    
    // Test full payment flow
    await testFullPaymentFlow();
    
    addTestResult('Test Suite', 'success', 'All tests completed');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const handlePaymentSuccess = (result: any) => {
    addTestResult('Card Payment', 'success', 
      `Payment successful: ${result.paymentIntentId} - Amount: $${testAmount}`);
    setShowCardForm(false);
  };

  const handlePaymentError = (error: string) => {
    addTestResult('Card Payment', 'error', `Payment failed: ${error}`);
  };

  const renderTestResults = () => (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Test Results</Text>
        <TouchableOpacity onPress={clearResults} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
        {testResults.map((result) => (
          <View key={result.id} style={[
            styles.resultItem,
            result.result === 'success' ? styles.successResult : styles.errorResult
          ]}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTest}>{result.test}</Text>
              <Text style={styles.resultTime}>{result.timestamp}</Text>
            </View>
            <Text style={styles.resultDetails}>{result.details}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderStripeStatus = () => (
    <View style={styles.statusContainer}>
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF']}
        style={styles.statusGradient}
      >
        <Text style={styles.statusTitle}>Stripe Configuration Status</Text>
        
        {stripeStatus ? (
          <View style={styles.statusDetails}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Environment:</Text>
              <Text style={styles.statusValue}>
                {stripeStatus.isTestMode ? '🧪 Test Mode' : '🚀 Production Mode'}
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Backend:</Text>
              <Text style={styles.statusValue}>{stripeStatus.backendMode}</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Stripe SDK:</Text>
              <Text style={styles.statusValue}>
                {stripeStatus.stripeInitialized ? '✅ Initialized' : '❌ Not Initialized'}
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Publishable Key:</Text>
              <Text style={styles.statusValue}>
                {stripeStatus.isValid ? '✅ Valid' : '❌ Invalid'}
              </Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="small" color="#007AFF" />
        )}
      </LinearGradient>
    </View>
  );

  const renderCardPaymentSection = () => (
    <View style={styles.cardPaymentContainer}>
      <Text style={styles.sectionTitle}>💳 Test Card Payment</Text>
      
      {!showCardForm ? (
        <TouchableOpacity 
          style={styles.cardPaymentButton} 
          onPress={() => setShowCardForm(true)}
        >
          <LinearGradient
            colors={['#28A745', '#20C997']}
            style={styles.cardPaymentButtonGradient}
          >
            <Text style={styles.cardPaymentButtonText}>Enter Card Details</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <View style={styles.cardFormContainer}>
          <CardInputForm
            amount={testAmount}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setShowCardForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Stripe Integration Test</Text>
          <Text style={styles.subtitle}>Test your payment integration</Text>
        </View>

        {/* Stripe Status */}
        {renderStripeStatus()}

        {/* Test Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={runAllTests}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={['#007AFF', '#0056CC']}
              style={styles.testButtonGradient}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.testButtonText}>🚀 Run All Tests</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.individualTests}>
            <TouchableOpacity 
              style={styles.smallTestButton} 
              onPress={testPaymentIntentCreation}
              disabled={isProcessing}
            >
              <Text style={styles.smallTestButtonText}>Test Payment Intent</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.smallTestButton} 
              onPress={testApplePay}
              disabled={isProcessing}
            >
              <Text style={styles.smallTestButtonText}>Test Apple Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.smallTestButton} 
              onPress={testGooglePay}
              disabled={isProcessing}
            >
              <Text style={styles.smallTestButtonText}>Test Google Pay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Payment Section */}
        {renderCardPaymentSection()}

        {/* Payment Method Selector */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Test Payment Method Selection</Text>
          <PaymentMethodSelector
            onPaymentMethodSelect={setSelectedPaymentMethod}
            selectedMethod={selectedPaymentMethod}
            amount={testAmount}
            disabled={isProcessing}
          />
        </View>

        {/* Test Results */}
        {renderTestResults()}
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
  statusContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusGradient: {
    padding: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusDetails: {
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  controlsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  testButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  testButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  individualTests: {
    flexDirection: 'row',
    gap: 12,
  },
  smallTestButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  smallTestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  cardPaymentContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardPaymentButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardPaymentButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPaymentButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardFormContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  resultsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  successResult: {
    backgroundColor: '#D4EDDA',
    borderLeftWidth: 4,
    borderLeftColor: '#28A745',
  },
  errorResult: {
    backgroundColor: '#F8D7DA',
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTest: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  resultTime: {
    fontSize: 12,
    color: '#666',
  },
  resultDetails: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

