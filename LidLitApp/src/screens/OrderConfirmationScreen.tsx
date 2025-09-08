import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  OrderConfirmation: {
    isHatFlow?: boolean;
    hatSize?: string;
    hatColor?: string;
    selectedTokenName?: string;
  };
  Home: undefined;
  CreateCustomToken: undefined;
};

type OrderConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;

export const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<OrderConfirmationScreenRouteProp>();
  const { isHatFlow, hatSize, hatColor, selectedTokenName } = route.params || {};

  // Determine if this is a hat flow or custom token flow
  const isHatPurchase = isHatFlow === true;

  const handleBackToHome = () => {
    console.log('Back to home pressed');
    navigation.navigate('Home');
  };

  const handleCreateCustomToken = () => {
    console.log('Create custom token pressed');
    navigation.navigate('CreateCustomToken');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Confirmation Message */}
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationMessage}>Your order has been placed!</Text>
          
          {/* Ordered Items - Different display for hat vs custom token flow */}
          {isHatPurchase ? (
            <View style={styles.itemsContainer}>
              <Image
                source={require('../../assets/hat.png')}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <Text style={styles.plusSign}>+</Text>
              <Image
                source={require('../../assets/ClevelandCavaliersToken.png')}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <Text style={styles.plusSign}>+</Text>
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderIcon}>▼</Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderIcon}>▼</Text>
            </View>
          )}
        </View>

        {/* What's Next Section */}
        <View style={styles.whatsNextSection}>
          <Text style={styles.whatsNextTitle}>What's Next?</Text>
          
          <View style={styles.infoCard}>
            {isHatPurchase ? (
              <>
                <Text style={styles.bulletPoint}>• You've received 1 free custom token</Text>
                <Text style={styles.bulletPoint}>• Create a custom token</Text>
                <Text style={styles.bulletPoint}>• Attach an image or video for NFC launch</Text>
                <Text style={styles.bulletPoint}>• Explore what others are making</Text>
                
                {/* Create Custom Token Button - Only for hat flow */}
                <TouchableOpacity style={styles.createTokenButton} onPress={handleCreateCustomToken}>
                  <Text style={styles.createTokenButtonText}>Create Custom Token</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.bulletPoint}>• We've received your order and started preparing it</Text>
                <Text style={styles.bulletPoint}>• 3D printing takes 2 days, plus 3 days for shipping</Text>
                <Text style={styles.bulletPoint}>• Estimated delivery: <Text style={styles.boldText}>September 24–28</Text></Text>
              </>
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Back to Home Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleBackToHome}>
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
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  plusSign: {
    fontSize: 24,
    color: '#666',
    marginHorizontal: 15,
    fontWeight: 'bold',
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
  createTokenButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  createTokenButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});
