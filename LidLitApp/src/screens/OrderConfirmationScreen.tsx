import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleBackToHome = () => {
    console.log('Back to home pressed');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Confirmation Message */}
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationMessage}>Your order has been placed!</Text>
          
          {/* Placeholder/Animation Area */}
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderIcon}>▼</Text>
          </View>
        </View>

        {/* What's Next Section */}
        <View style={styles.whatsNextSection}>
          <Text style={styles.whatsNextTitle}>What's Next?</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.bulletPoint}>• We've received your order and started preparing it</Text>
            <Text style={styles.bulletPoint}>• 3D printing takes 2 days, plus 3 days for shipping</Text>
            <Text style={styles.bulletPoint}>• Estimated delivery: <Text style={styles.boldText}>September 24–28</Text></Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Back to Home Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backToHomeButton} onPress={handleBackToHome}>
          <Text style={styles.backToHomeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  confirmationMessage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 30,
    textAlign: 'center',
  },
  placeholderBox: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  placeholderIcon: {
    fontSize: 32,
    color: '#E0E0E0',
  },
  whatsNextSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  whatsNextTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backToHomeButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 35,
    alignItems: 'center',
    minWidth: 200,
    alignSelf: 'center',
  },
  backToHomeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
