import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { height } = Dimensions.get('window');

interface CreateTokenDrawerProps {
  visible: boolean;
  onClose: () => void;
  onUseAI: () => void;
  onUploadPhoto: () => void;
  onTakePhoto: () => void;
}

export const CreateTokenDrawer: React.FC<CreateTokenDrawerProps> = ({
  visible,
  onClose,
  onUseAI,
  onUploadPhoto,
  onTakePhoto,
}) => {
  const navigation = useNavigation();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const drawerTranslateY = useRef(new Animated.Value(height)).current;
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadPhoto = async () => {
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
              { text: 'Grant Permission', onPress: handleUploadPhoto }
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
        // Photo selected successfully - navigate to preview screen
        onClose();
        if (navigation) {
          (navigation as any).navigate('ImageUploadPreview', { 
            imageUri: result.assets[0].uri 
          });
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Request permissions first
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera permissions to make this work!',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Grant Permission', onPress: handleTakePhoto }
            ]
          );
          return;
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Photo captured successfully - navigate to photo editing screen
        onClose();
        if (navigation) {
          (navigation as any).navigate('PhotoEditing', { 
            imageUri: result.assets[0].uri 
          });
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleGestureEvent = (event: any) => {
    const { translationY, state } = event.nativeEvent;
    
    if (state === State.ACTIVE) {
      setIsDragging(true);
      // Smooth dragging - follow finger exactly
      drawerTranslateY.setValue(Math.max(0, translationY));
    } else if (state === State.END) {
      setIsDragging(false);
      const shouldClose = translationY > 80; // Lower threshold for easier closing
      
      if (shouldClose) {
        // Close immediately when threshold is met
        console.log('Closing drawer - threshold met:', translationY);
        onClose();
      } else {
        // Snap back smoothly
        console.log('Snapping back - threshold not met:', translationY);
        Animated.spring(drawerTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  };

  useEffect(() => {
    if (visible) {
      // Reset values
      backdropOpacity.setValue(0);
      drawerTranslateY.setValue(height);
      
      // Animate backdrop first (fade in)
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        // Then animate drawer sliding up smoothly
        Animated.timing(drawerTranslateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Animate drawer sliding down first
      Animated.timing(drawerTranslateY, {
        toValue: height,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        // Then fade out backdrop
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
          {/* Backdrop */}
          <TouchableOpacity style={styles.backdrop} onPress={onClose} />
          
          {/* Drawer */}
          <PanGestureHandler 
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleGestureEvent}
            activeOffsetY={[-5, 5]}
            activeOffsetX={[-30, 30]}
          >
            <Animated.View 
              style={[
                styles.drawer, 
                { transform: [{ translateY: drawerTranslateY }] }
              ]}
            >
            {/* Radial Background */}
            <LinearGradient
              colors={['#363636', '#020202']}
              style={styles.radialBackground}
              start={{ x: 0, y: 0.3 }}
              end={{ x: 0.5, y: 0.8 }}
            />
            
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            
            {/* Handle */}
            <View style={styles.handle} />
            
            {/* Title */}
            <Text style={styles.title}>Create your token</Text>
          
          {/* Options */}
          <View style={styles.optionsContainer}>
                                                 {/* Use AI Magic */}
                        <TouchableOpacity style={styles.option} onPress={() => {
                          onClose();
                          if (navigation) {
                            navigation.navigate('AITokenGeneration' as never);
                          }
                        }}>
                          <View style={[styles.iconContainer, styles.aiIconContainer]}>
                            <Image
                              source={require('../../assets/GenUsingAI.png')}
                              style={styles.icon}
                              resizeMode="contain"
                            />
                          </View>
                          <Text style={styles.optionText}>Use AI Magic!</Text>
                        </TouchableOpacity>
             
             {/* Upload Photo */}
             <TouchableOpacity style={styles.option} onPress={handleUploadPhoto}>
               <View style={[styles.iconContainer, styles.uploadIconContainer]}>
                 <Image
                   source={require('../../assets/UploadPicture.png')}
                   style={styles.icon}
                   resizeMode="contain"
                 />
               </View>
               <Text style={styles.optionText}>Upload Photo</Text>
             </TouchableOpacity>
             
             {/* Take Photo */}
             <TouchableOpacity style={styles.option} onPress={handleTakePhoto}>
               <View style={[styles.iconContainer, styles.cameraIconContainer]}>
                 <Image
                   source={require('../../assets/SnapAPicture.png')}
                   style={styles.icon}
                   resizeMode="contain"
                 />
               </View>
               <Text style={styles.optionText}>Take Photo</Text>
             </TouchableOpacity>
          </View>
        </Animated.View>
        </PanGestureHandler>
      </Animated.View>
        </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  radialBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 32,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
    lineHeight: 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'left',
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  aiIconContainer: {
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  uploadIconContainer: {
    shadowColor: '#FF9800',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  cameraIconContainer: {
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    width: 40,
    height: 40,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
