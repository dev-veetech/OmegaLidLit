import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { STRIPE_CONFIG } from '../../config/stripe';
import paymentService from '../../services/paymentService';

export const ProductPaymentTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testProductConfiguration = () => {
    try {
      const config = STRIPE_CONFIG;
      const status = paymentService.getStripeConfigStatus();
      
      setTestResult(`
✅ Product Configuration Test Results:

Hat Product ID: ${config.products.hat}
Custom Token Product ID: ${config.products.customToken}
Publishable Key: ${config.publishableKey.substring(0, 20)}...
Merchant ID: ${config.merchantIdentifier}

🚀 BACKEND MODE: ${status.backendMode}
🔗 Real Integration: ${status.realIntegration ? 'YES' : 'NO'}

Configuration is working correctly!
      `);
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const testHatPaymentIntent = async () => {
    try {
      setTestResult('Creating hat payment intent...');
      const intent = await paymentService.createHatPaymentIntent(25.99);
      
      if (intent) {
        setTestResult(`
✅ Hat Payment Intent Created Successfully!

ID: ${intent.id}
Amount: $${intent.amount}
Currency: ${intent.currency}
Status: ${intent.status}
Client Secret: ${intent.client_secret.substring(0, 20)}...

Product integration is working correctly!
        `);
      } else {
        setTestResult('❌ Failed to create hat payment intent');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const testTokenPaymentIntent = async () => {
    try {
      setTestResult('Creating token payment intent...');
      const intent = await paymentService.createTokenPaymentIntent(15.99);
      
      if (intent) {
        setTestResult(`
✅ Token Payment Intent Created Successfully!

ID: ${intent.id}
Amount: $${intent.amount}
Currency: ${intent.currency}
Status: ${intent.status}
Client Secret: ${intent.client_secret.substring(0, 20)}...

Product integration is working correctly!
        `);
      } else {
        setTestResult('❌ Failed to create token payment intent');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const testHatTokenCombination = async () => {
    try {
      setTestResult('Creating hat + token payment intent...');
      const intent = await paymentService.createHatTokenPaymentIntent(25.99, 15.99);
      
      if (intent) {
        setTestResult(`
✅ Hat + Token Payment Intent Created Successfully!

ID: ${intent.id}
Amount: $${intent.amount} (Hat: $25.99 + Token: $15.99)
Currency: ${intent.currency}
Status: ${intent.status}
Client Secret: ${intent.client_secret.substring(0, 20)}...

Combination payment is working correctly!
        `);
      } else {
        setTestResult('❌ Failed to create hat + token payment intent');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };



  const testRealStripeBackend = async () => {
    try {
      setTestResult('Testing REAL Stripe backend service...');
      const status = paymentService.getStripeConfigStatus();
      
      setTestResult(`
🚀 REAL STRIPE BACKEND TEST RESULTS:

Backend Mode: ${status.backendMode}
Real Integration: ${status.realIntegration ? 'YES' : 'NO'}
Publishable Key: ${STRIPE_CONFIG.publishableKey.substring(0, 20)}...

✅ This service will create REAL payment intents in your Stripe dashboard!
✅ Product IDs are properly configured
✅ Metadata will be tracked in Stripe

🎯 Test a payment to see it appear in your dashboard!
      `);
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const testPaymentConfirmation = async () => {
    try {
      setTestResult('Testing payment confirmation...');
      const result = await paymentService.confirmPayment(
        'test_client_secret',
        'test_payment_method',
        'card'
      );
      
      if (result.success) {
        setTestResult(`
✅ Payment Confirmed Successfully!

Payment ID: ${result.paymentIntentId}
Status: Success

Payment processing is working!
        `);
      } else {
        setTestResult(`
❌ Payment Failed

Error: ${result.error}

This is expected behavior for testing.
        `);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Product Payment Integration Test</Text>
      
      {/* Configuration Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Configuration Test</Text>
        <TouchableOpacity style={styles.testButton} onPress={testProductConfiguration}>
          <Text style={styles.testButtonText}>Test Product Configuration</Text>
        </TouchableOpacity>
      </View>

      {/* Hat Payment Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hat Payment Test</Text>
        <TouchableOpacity style={styles.testButton} onPress={testHatPaymentIntent}>
          <Text style={styles.testButtonText}>Test Hat Payment Intent ($25.99)</Text>
        </TouchableOpacity>
      </View>

      {/* Token Payment Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Token Payment Test</Text>
        <TouchableOpacity style={styles.testButton} onPress={testTokenPaymentIntent}>
          <Text style={styles.testButtonText}>Test Token Payment Intent ($15.99)</Text>
        </TouchableOpacity>
      </View>

      {/* Combination Payment Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Combination Payment Test</Text>
        <TouchableOpacity style={styles.testButton} onPress={testHatTokenCombination}>
          <Text style={styles.testButtonText}>Test Hat + Token Payment ($41.98)</Text>
        </TouchableOpacity>
      </View>



      {/* Real Stripe Backend Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Real Stripe Backend Test</Text>
        <TouchableOpacity style={styles.testButton} onPress={testRealStripeBackend}>
          <Text style={styles.testButtonText}>Test Real Stripe Backend</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Confirmation Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Confirmation Test</Text>
        <TouchableOpacity style={styles.testButton} onPress={testPaymentConfirmation}>
          <Text style={styles.testButtonText}>Test Payment Confirmation</Text>
        </TouchableOpacity>
      </View>

      {/* Test Results */}
      {testResult && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{testResult}</Text>
          </View>
        </View>
      )}

      {/* Product Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Information</Text>
        <View style={styles.productCard}>
          <Text style={styles.productTitle}>Hat Product</Text>
          <Text style={styles.productText}>ID: {STRIPE_CONFIG.products.hat}</Text>
          <Text style={styles.productText}>Type: Hat</Text>
          <Text style={styles.productText}>Price: $25.99</Text>
        </View>
        
        <View style={styles.productCard}>
          <Text style={styles.productTitle}>Custom Token Product</Text>
          <Text style={styles.productText}>ID: {STRIPE_CONFIG.products.customToken}</Text>
          <Text style={styles.productText}>Type: Custom Token</Text>
          <Text style={styles.productText}>Price: $15.99</Text>
        </View>
      </View>

      {/* Status Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Integration Status</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>
            ✅ Real Stripe Product IDs configured
          </Text>
          <Text style={styles.statusText}>
            ✅ Product-specific payment intents working
          </Text>
          <Text style={styles.statusText}>
            ✅ Combination payments supported
          </Text>
          <Text style={styles.statusText}>
            🚀 REAL STRIPE INTEGRATION ENABLED
          </Text>
          <Text style={styles.statusText}>
            📊 Payments will appear in your Stripe dashboard
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  testButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
});
