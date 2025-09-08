import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HatPreviewDrawer } from '../components/HatPreviewDrawer';

type RootStackParamList = {
  TokenPreview: { 
    imageUrl: string; 
    prompt: string; 
    tokenId: string;
    isFirstToken?: boolean; // First token is free
  };
};

type TokenPreviewScreenRouteProp = RouteProp<RootStackParamList, 'TokenPreview'>;

const { width } = Dimensions.get('window');

export const TokenPreviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TokenPreviewScreenRouteProp>();
  const { imageUrl, prompt, tokenId, isFirstToken = false } = route.params;
  
  const [showHatPreview, setShowHatPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreviewOnHat = () => {
    setShowHatPreview(true);
  };

  const handleCloseHatPreview = () => {
    setShowHatPreview(false);
  };

  const handleSaveForLater = () => {
    // Save token to user's collection
    Alert.alert(
      'Token Saved!',
      'Your custom token has been saved to your collection.',
      [{ text: 'OK' }]
    );
  };

  const handleUseToken = () => {
    if (isFirstToken) {
      // First token is free - navigate to hat selection
      navigation.navigate('TokenSelection', { 
        selectedTokenId: tokenId,
        isFreeToken: true 
      });
    } else {
      // Additional tokens require payment
      navigation.navigate('Checkout', {
        hatSize: 'M', // Default size
        hatColor: 'Black', // Default color
        hatPrice: 25.99,
        selectedTokenName: 'Custom AI Token',
        tokenPrice: 15.99, // Price for additional tokens
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Token Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {prompt.length > 100 ? `${prompt.substring(0, 100)}...` : prompt}
          </Text>
        </View>

        {/* Token Image Preview */}
        <View style={styles.imagePreviewContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.tokenImage} 
              resizeMode="cover"
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No token generated</Text>
            </View>
          )}
          
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#00ff88" />
              <Text style={styles.loadingText}>Loading token...</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.previewButton} onPress={handlePreviewOnHat}>
            <Text style={styles.previewButtonText}>Preview on hat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveForLater}>
            <Text style={styles.saveButtonText}>Save for later</Text>
          </TouchableOpacity>
        </View>

        {/* Token Info */}
        <View style={styles.tokenInfoContainer}>
          <Text style={styles.tokenInfoTitle}>Token Details</Text>
          <Text style={styles.tokenInfoText}>ID: {tokenId}</Text>
          <Text style={styles.tokenInfoText}>
            Status: {isFirstToken ? 'FREE (First Token)' : 'Premium Token'}
          </Text>
          <Text style={styles.tokenInfoText}>
            Price: {isFirstToken ? 'FREE' : '$15.99'}
          </Text>
        </View>
      </View>

      {/* Bottom Input Area */}
      <View style={styles.bottomInputContainer}>
        <View style={styles.inputField}>
          <Text style={styles.inputPlaceholder}>Describe your idea</Text>
          <Text style={styles.wordCounter}>0/300 words</Text>
        </View>
        
        {/* Floating Action Buttons */}
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fabSecondary}>
            <Text style={styles.fabText}>D</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.fabPrimary} onPress={handleUseToken}>
            <Image 
              source={require('../../assets/GenUsingAI.png')} 
              style={styles.magicWandIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hat Preview Drawer */}
      <HatPreviewDrawer
        visible={showHatPreview}
        imageUri={imageUrl}
        onClose={handleCloseHatPreview}
        onUseImage={handleUseToken}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  descriptionText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
  },
  tokenImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  previewButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 15,
  },
  previewButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tokenInfoContainer: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  tokenInfoTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tokenInfoText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  bottomInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
    borderBottomWidth: 0,
  },
  inputField: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 40,
    position: 'relative',
  },
  inputPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  wordCounter: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    fontSize: 12,
    color: '#999',
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabSecondary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff69b4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fabPrimary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
  },
  magicWandIcon: {
    width: 24,
    height: 24,
  },
});


