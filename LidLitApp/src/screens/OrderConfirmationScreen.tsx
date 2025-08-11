import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CreateTokenDrawer } from '../components/CreateTokenDrawer';

const { width } = Dimensions.get('window');

export const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  const handleCreateCustomToken = () => {
    setShowCreateDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowCreateDrawer(false);
  };

  const handleUseAI = () => {
    console.log('Use AI Magic pressed');
    setShowCreateDrawer(false);
  };

  const handleUploadPhoto = () => {
    console.log('Upload Photo pressed');
    setShowCreateDrawer(false);
  };

  const handleTakePhoto = () => {
    console.log('Take Photo pressed');
    setShowCreateDrawer(false);
  };

  const handleBackToHome = () => {
    // Navigate back to home
    navigation.navigate('Home' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Confirmation Message */}
        <Text style={styles.confirmationMessage}>Your order has been placed!</Text>

        {/* Ordered Items Display */}
        <View style={styles.itemsContainer}>
          {/* Hat */}
          <View style={styles.itemContainer}>
            <Image
              source={require('../../assets/hat.png')}
              style={styles.itemImage}
              resizeMode="contain"
            />
          </View>

          {/* Plus Sign */}
          <Text style={styles.plusSign}>+</Text>

          {/* Cleveland Cavaliers Token */}
          <View style={styles.itemContainer}>
            <Image
              source={require('../../assets/ClevelandCavaliersToken.png')}
              style={styles.itemImage}
              resizeMode="contain"
            />
          </View>

          {/* Plus Sign */}
          <Text style={styles.plusSign}>+</Text>

          {/* Custom Token Placeholder */}
          <View style={styles.placeholderContainer}>
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderIcon}>▼</Text>
            </View>
          </View>
        </View>

        {/* What's Next Section */}
        <View style={styles.whatsNextSection}>
          <Text style={styles.whatsNextTitle}>What's Next?</Text>
          
          <View style={styles.whatsNextCard}>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>You've received 1 free custom token</Text>
            </View>
            
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Create a custom token</Text>
            </View>
            
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Attach an image or video for NFC launch</Text>
            </View>
            
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Explore what others are making</Text>
            </View>

            {/* Create Custom Token Button */}
            <TouchableOpacity style={styles.createTokenButton} onPress={handleCreateCustomToken}>
              <Text style={styles.createTokenButtonText}>Create Custom Token</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity style={styles.backToHomeButton} onPress={handleBackToHome}>
          <Text style={styles.backToHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Create Token Drawer */}
      <CreateTokenDrawer
        visible={showCreateDrawer}
        onClose={handleCloseDrawer}
        onUseAI={handleUseAI}
        onUploadPhoto={handleUploadPhoto}
        onTakePhoto={handleTakePhoto}
      />
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  confirmationMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color
    textAlign: 'center',
    marginBottom: 40,
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  plusSign: {
    fontSize: 32,
    color: '#666',
    marginHorizontal: 20,
    fontWeight: 'bold',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  placeholderIcon: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  whatsNextSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  whatsNextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  whatsNextCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 18,
    color: '#666',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    flex: 1,
  },
  createTokenButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createTokenButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToHomeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  backToHomeText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
