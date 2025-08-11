import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleAppleSignIn = () => {
    // Navigate to Order Confirmation screen
    navigation.navigate('OrderConfirmation' as never);
  };

  const handleGoogleSignIn = () => {
    // Navigate to Order Confirmation screen
    navigation.navigate('OrderConfirmation' as never);
  };

  const handleTermsPress = () => {
    // Navigate to terms or open terms URL
    console.log('Terms pressed');
  };

  const handlePrivacyPress = () => {
    // Navigate to privacy or open privacy URL
    console.log('Privacy pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Brand Name */}
        <Text style={styles.brandName}>omega</Text>
        
        {/* Instructional Text */}
        <Text style={styles.instructionText}>
          To use Omega you must log into or create one using one of the options below
        </Text>

        {/* Hat Illustration */}
        <View style={styles.hatContainer}>
          <Image
            source={require('../../assets/SignIn.png')}
            style={styles.hatImage}
            resizeMode="contain"
          />
        </View>

        {/* Sign In Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Apple Sign In Button */}
          <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignIn}>
            <Image
              source={require('../../assets/ApplePay.png')}
              style={styles.appleIcon}
              resizeMode="contain"
            />
            <Text style={styles.appleButtonText}>Sign in with Apple</Text>
          </TouchableOpacity>

          {/* Google Sign In Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Image
              source={require('../../assets/GooglePay.png')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Text */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>
            By signing in, you agree to our{' '}
            <Text style={styles.legalLink} onPress={handleTermsPress}>
              Terms
            </Text>
            {' '}&{' '}
            <Text style={styles.legalLink} onPress={handlePrivacyPress}>
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '300',
    color: '#999',
    marginBottom: 12,
    letterSpacing: 1,
  },
  instructionText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  hatContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  hatImage: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 250,
    maxHeight: 250,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  appleButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  legalContainer: {
    paddingHorizontal: 40,
  },
  legalText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    textDecorationLine: 'underline',
    color: '#666',
  },
});
