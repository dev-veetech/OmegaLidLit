import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HatPreviewDrawer } from '../components/HatPreviewDrawer';
import backgroundRemovalService from '../services/backgroundRemovalService';

type RootStackParamList = {
  PhotoEditing: { imageUri: string };
  TokenFinalization: undefined;
};

type PhotoEditingScreenRouteProp = RouteProp<RootStackParamList, 'PhotoEditing'>;

const { width, height } = Dimensions.get('window');

export const PhotoEditingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<PhotoEditingScreenRouteProp>();
  const { imageUri } = route.params;
  const [showHatPreview, setShowHatPreview] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);

  const handleRemoveBackground = async () => {
    try {
      setIsRemovingBackground(true);
      console.log('🖼️ Starting background removal...');
      
      const result = await backgroundRemovalService.removeBackground({
        imageUri: imageUri,
        threshold: 0,
        backgroundType: 'rgba',
        format: 'png'
      });

      if (result.success && result.imageUrl) {
        setProcessedImageUri(result.imageUrl);
        console.log('✅ Background removed successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to remove background');
        console.error('❌ Background removal failed:', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('❌ Unexpected error:', error);
    } finally {
      setIsRemovingBackground(false);
    }
  };


  const handleRetry = () => {
    navigation.goBack();
  };

  const handlePreviewOnHat = () => {
    setShowHatPreview(true);
  };

  const handleCloseHatPreview = () => {
    setShowHatPreview(false);
  };

  const handleUseImage = () => {
    // Navigate to checkout with proper parameters
    console.log('Use image pressed');
    setShowHatPreview(false);
    // Add a small delay to ensure modal closes properly
    setTimeout(() => {
      navigation.navigate('Checkout', {
        amount: 25.99, // Hat price
        productType: 'hatTokenCombo', // Hat + custom token combo
        productId: 'hat_custom_token_combo', // Product identifier
        description: 'Hat with Custom Token',
        metadata: {
          hatSize: 'M',
          hatColor: 'Black',
          selectedTokenName: 'Custom Token',
          tokenPrice: '0',
          hatPrice: '25.99',
          imageUri: processedImageUri || imageUri, // Use processed image if available
        },
      });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Main Photo */}
      <View style={styles.photoContainer}>
        <Image 
          source={{ uri: processedImageUri || imageUri }} 
          style={styles.photo} 
          resizeMode="cover" 
        />
        
        {/* Image Manipulation Overlays */}
        <View style={styles.overlayContainer}>
          <TouchableOpacity 
            style={styles.overlayButton} 
            onPress={handleRemoveBackground}
            disabled={isRemovingBackground}
          >
            <View style={styles.overlayIcon}>
              {isRemovingBackground ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.overlayIconText}>⊘</Text>
              )}
            </View>
            <Text style={styles.overlayText}>
              {isRemovingBackground ? 'Processing...' : 'Remove BG'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.previewButton} onPress={handlePreviewOnHat}>
          <Text style={styles.previewButtonText}>Preview on Hat</Text>
        </TouchableOpacity>
      </View>

      {/* Hat Preview Drawer */}
      <HatPreviewDrawer
        visible={showHatPreview}
        imageUri={processedImageUri || imageUri}
        onClose={handleCloseHatPreview}
        onUseImage={handleUseImage}
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
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 20,
  },
  overlayContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  overlayButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overlayIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  overlayIconText: {
    fontSize: 20,
    color: '#fff',
  },
  overlayText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
  },
  retryButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewButton: {
    flex: 1,
    backgroundColor: '#00CED1',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
