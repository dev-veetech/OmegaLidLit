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
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { HatPreviewDrawer } from '../components/HatPreviewDrawer';

type RootStackParamList = {
  ImageUploadPreview: { imageUri: string };
};

type ImageUploadPreviewScreenRouteProp = RouteProp<RootStackParamList, 'ImageUploadPreview'>;

const { width } = Dimensions.get('window');

export const ImageUploadPreviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ImageUploadPreviewScreenRouteProp>();
  const { imageUri } = route.params;
  const [showHatPreview, setShowHatPreview] = useState(false);

  const handlePreviewOnHat = () => {
    setShowHatPreview(true);
  };

  const handleCloseHatPreview = () => {
    setShowHatPreview(false);
  };

  const handleUseImage = () => {
    // Navigate to final confirmation or order screen
    console.log('Use image pressed');
    setShowHatPreview(false);
    navigation.navigate('TokenFinalization');
  };

  const handleSelectFile = async () => {
    try {
      // Request permissions first
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera roll permissions to make this work!',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Grant Permission', onPress: handleSelectFile }
            ]
          );
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Photo selected successfully - update the current image
        const newImageUri = result.assets[0].uri;
        // Here you would typically update the state or navigate to a new screen
        // For now, we'll just show a success message
        Alert.alert(
          'Photo Selected!',
          'Your new photo has been selected successfully.',
          [
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload a Picture</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.imagePreviewContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.uploadedImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.previewButton} onPress={handlePreviewOnHat}>
          <Text style={styles.previewButtonText}>Preview on Hat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectFileContainer}>
                 <TouchableOpacity style={styles.selectFileButton} onPress={handleSelectFile}>
           <Image
             source={require('../../assets/UploadPicture.png')}
             style={styles.selectFileIcon}
             resizeMode="contain"
           />
           <Text style={styles.selectFileText}>Select file</Text>
         </TouchableOpacity>
      </View>

      {/* Hat Preview Drawer */}
      <HatPreviewDrawer
        visible={showHatPreview}
        imageUri={imageUri}
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imagePreviewContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#004d40',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 30,
  },
  uploadedImage: {
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
  previewButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    marginBottom: 20,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectFileContainer: {
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
  selectFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  selectFileIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  selectFileText: {
    color: '#fff',
    fontSize: 16,
  },
});
