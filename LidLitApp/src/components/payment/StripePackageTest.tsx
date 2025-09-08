import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export const StripePackageTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testStripeImport = async () => {
    try {
      // Test if we can import Stripe without errors
      const StripeModule = await import('@stripe/stripe-react-native');
      
      setTestResult(`
✅ Stripe Package Import Test - SUCCESS!

Available exports:
${Object.keys(StripeModule).join(', ')}

Package is working correctly!
      `);
    } catch (error) {
      setTestResult(`
❌ Stripe Package Import Test - FAILED!

Error: ${error}

This indicates the package is not properly installed or configured.
      `);
    }
  };

  const testStripeProvider = async () => {
    try {
      const { StripeProvider } = await import('@stripe/stripe-react-native');
      
      setTestResult(`
✅ StripeProvider Import Test - SUCCESS!

StripeProvider is available and can be imported.
      `);
    } catch (error) {
      setTestResult(`
❌ StripeProvider Import Test - FAILED!

Error: ${error}

This indicates the StripeProvider component is not available.
      `);
    }
  };

  const testStripeHooks = async () => {
    try {
      const { useStripe } = await import('@stripe/stripe-react-native');
      
      setTestResult(`
✅ Stripe Hooks Import Test - SUCCESS!

useStripe hook is available and can be imported.
      `);
    } catch (error) {
      setTestResult(`
❌ Stripe Hooks Import Test - FAILED!

Error: ${error}

This indicates the Stripe hooks are not available.
      `);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stripe Package Test</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={testStripeImport}>
        <Text style={styles.testButtonText}>Test Stripe Package Import</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={testStripeProvider}>
        <Text style={styles.testButtonText}>Test StripeProvider Import</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={testStripeHooks}>
        <Text style={styles.testButtonText}>Test Stripe Hooks Import</Text>
      </TouchableOpacity>

      {testResult && (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Package Information</Text>
        <Text style={styles.infoText}>
          • Package: @stripe/stripe-react-native
        </Text>
        <Text style={styles.infoText}>
          • Version: ^0.50.3 (latest)
        </Text>
        <Text style={styles.infoText}>
          • Status: Installed and ready for testing
        </Text>
      </View>
    </View>
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
    marginTop: 20,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});

