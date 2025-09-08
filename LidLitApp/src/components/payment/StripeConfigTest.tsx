import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { STRIPE_CONFIG } from '../../config/stripe';
import paymentService from '../../services/paymentService';

export const StripeConfigTest: React.FC = () => {
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    const status = paymentService.getStripeConfigStatus();
    setConfigStatus(status);
  };

  const testPaymentIntent = async () => {
    try {
      setTestResult('Creating payment intent...');
      const intent = await paymentService.createPaymentIntent(25.99);
      
      if (intent) {
        setTestResult(`✅ Payment Intent Created!\nID: ${intent.id}\nAmount: $${intent.amount}\nStatus: ${intent.status}`);
      } else {
        setTestResult('❌ Failed to create payment intent');
      }
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
        setTestResult(`✅ Payment Confirmed!\nPayment ID: ${result.paymentIntentId}`);
      } else {
        setTestResult(`❌ Payment Failed: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const toggleBackend = () => {
    const currentMode = paymentService.isUsingMockBackend();
    paymentService.setUseMockBackend(!currentMode);
    checkConfiguration();
    Alert.alert(
      'Backend Mode Changed',
      `Switched to ${!currentMode ? 'Mock' : 'Real'} Backend`
    );
  };

  if (!configStatus) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading configuration...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Stripe Configuration Test</Text>
      
      {/* Configuration Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration Status</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>
            <Text style={styles.label}>Publishable Key: </Text>
            {configStatus.publishableKey.substring(0, 20)}...
          </Text>
          <Text style={styles.statusText}>
            <Text style={styles.label}>Test Mode: </Text>
            {configStatus.isTestMode ? '✅ Yes' : '❌ No'}
          </Text>
          <Text style={styles.statusText}>
            <Text style={styles.label}>Valid Key: </Text>
            {configStatus.isValid ? '✅ Yes' : '❌ No'}
          </Text>
          <Text style={styles.statusText}>
            <Text style={styles.label}>Merchant ID: </Text>
            {configStatus.merchantIdentifier}
          </Text>
          <Text style={styles.statusText}>
            <Text style={styles.label}>Google Pay ID: </Text>
            {configStatus.googlePayMerchantId}
          </Text>
        </View>
      </View>

      {/* Backend Mode */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Backend Mode</Text>
        <View style={styles.modeCard}>
          <Text style={styles.modeText}>
            Current Mode: <Text style={styles.highlight}>
              {paymentService.isUsingMockBackend() ? 'Mock Backend' : 'Real Backend'}
            </Text>
          </Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleBackend}>
            <Text style={styles.toggleButtonText}>
              Switch to {paymentService.isUsingMockBackend() ? 'Real' : 'Mock'} Backend
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Test Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Functions</Text>
        <TouchableOpacity style={styles.testButton} onPress={testPaymentIntent}>
          <Text style={styles.testButtonText}>Test Payment Intent Creation</Text>
        </TouchableOpacity>
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

      {/* Test Cards Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Card Information</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>Visa: 4242424242424242</Text>
          <Text style={styles.cardText}>Mastercard: 5555555555554444</Text>
          <Text style={styles.cardText}>Amex: 378282246310005</Text>
          <Text style={styles.cardText}>Exp: 12/25, CVC: 123</Text>
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
  label: {
    fontWeight: '600',
    color: '#333',
  },
  modeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modeText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  highlight: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  },
  cardInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
    fontFamily: 'monospace',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

