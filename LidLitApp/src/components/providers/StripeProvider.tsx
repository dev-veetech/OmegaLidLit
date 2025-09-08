import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StripeProvider as StripeProviderBase } from '@stripe/stripe-react-native';
import { STRIPE_CONFIG } from '../../config/stripe';

interface StripeProviderProps {
  children: React.ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeStripe();
  }, []);

  const initializeStripe = async () => {
    try {
      // Check if Stripe configuration is valid
      if (!STRIPE_CONFIG.publishableKey) {
        setError('Stripe publishable key not configured. Please update the configuration.');
        return;
      }

      // Validate that the key is a real Stripe key (not placeholder)
      if (STRIPE_CONFIG.publishableKey.includes('your_publishable_key') || 
          STRIPE_CONFIG.publishableKey.length < 50) {
        setError('Invalid Stripe publishable key. Please check your configuration.');
        return;
      }

      // Additional Stripe initialization can be added here
      // For now, we'll just set it as ready
      setIsStripeReady(true);
    } catch (err) {
      console.error('Failed to initialize Stripe:', err);
      setError('Failed to initialize payment system. Please try again later.');
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Please check your Stripe configuration and try again.
        </Text>
      </View>
    );
  }

  if (!isStripeReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Initializing payment system...</Text>
      </View>
    );
  }

  return (
    <StripeProviderBase
      publishableKey={STRIPE_CONFIG.publishableKey}
      merchantIdentifier={STRIPE_CONFIG.merchantIdentifier}
      urlScheme="lidlit"
    >
      {children}
    </StripeProviderBase>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
