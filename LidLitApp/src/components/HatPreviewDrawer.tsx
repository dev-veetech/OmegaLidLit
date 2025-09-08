import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, State, simultaneousHandlers } from 'react-native-gesture-handler';

interface HatPreviewDrawerProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onUseImage: () => void;
  navigation?: any;
}

export const HatPreviewDrawer: React.FC<HatPreviewDrawerProps> = ({
  visible,
  imageUri,
  onClose,
  onUseImage,
  navigation,
}) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const drawerTranslateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const tokenScale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  
  // Gesture handler refs
  const panGestureRef = useRef(null);
  const pinchGestureRef = useRef(null);
  
  // Token size constraints
  const MIN_SCALE = 0.5; // Minimum 50% of original size
  const MAX_SCALE = 1.4;  // Maximum 140% of original size
  const [currentScale, setCurrentScale] = useState(1);

  const handleGestureEvent = (event: any) => {
    const { translationY, state, numberOfPointers } = event.nativeEvent;
    
    // Don't handle pan gestures if pinching is active or if there are 2+ fingers
    if (isPinching || numberOfPointers >= 2) {
      return;
    }
    
    if (state === State.ACTIVE) {
      setIsDragging(true);
      // Smooth dragging - follow finger exactly
      drawerTranslateY.setValue(Math.max(0, translationY));
    } else if (state === State.END) {
      setIsDragging(false);
      const shouldClose = translationY > 80; // Lower threshold for easier closing
      
      if (shouldClose) {
        // Close immediately when threshold is met
        console.log('Closing HatPreviewDrawer - threshold met:', translationY);
        onClose();
      } else {
        // Snap back smoothly
        console.log('Snapping back HatPreviewDrawer - threshold not met:', translationY);
        Animated.spring(drawerTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  };

  const handlePinchGesture = (event: any) => {
    const { scale, state, numberOfPointers } = event.nativeEvent;
    
    if (state === State.BEGAN && numberOfPointers >= 2) {
      setIsPinching(true);
      tokenScale.setValue(currentScale);
    } else if (state === State.ACTIVE && numberOfPointers >= 2) {
      // Improve sensitivity: make scale changes more responsive
      // Use a more sensitive scale calculation for better user experience
      const sensitivityFactor = 1.2; // Makes gestures more responsive
      const adjustedScale = 1 + (scale - 1) * sensitivityFactor;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale * adjustedScale));
      tokenScale.setValue(newScale);
    } else if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
      setIsPinching(false);
      if (scale !== undefined) {
        // Apply the same sensitivity factor to final scale
        const sensitivityFactor = 1.2;
        const adjustedScale = 1 + (scale - 1) * sensitivityFactor;
        const finalScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale * adjustedScale));
        setCurrentScale(finalScale);
        tokenScale.setValue(finalScale);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      // Reset values
      backdropOpacity.setValue(0);
      drawerTranslateY.setValue(Dimensions.get('window').height);
      tokenScale.setValue(1);
      setCurrentScale(1);
      setIsPinching(false);
      
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
        toValue: Dimensions.get('window').height,
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
        <Animated.View style={[styles.modalOverlay, { opacity: backdropOpacity }]}>
          {/* Backdrop - Click outside to close */}
          <TouchableOpacity style={styles.backdrop} onPress={onClose} />
          
          {/* Drawer */}
          <PanGestureHandler 
            ref={panGestureRef}
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleGestureEvent}
            activeOffsetY={[-5, 5]}
            activeOffsetX={[-30, 30]}
            maxPointers={1}
          >
            <Animated.View 
              style={[
                styles.hatPreviewContainer, 
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
              
              {/* Drag Handle */}
              <View style={styles.dragHandle} />
              
                        {/* Instructions */}
          <View style={styles.instructions}>
            <Image 
              source={require('../../assets/pinchToResize.png')} 
              style={styles.instructionIcon} 
              resizeMode="contain"
            />
            <Text style={styles.instructionText}>Pinch to resize token</Text>
          </View>
              
              {/* Hat with Image */}
              <PinchGestureHandler
                ref={pinchGestureRef}
                onGestureEvent={handlePinchGesture}
                onHandlerStateChange={handlePinchGesture}
                minPointers={2}
              >
                <Animated.View style={[
                  styles.hatContainer,
                  isPinching && styles.pinchingActive
                ]}>
                  <Image 
                    source={require('../../assets/hat.png')} 
                    style={styles.hatImage} 
                    resizeMode="contain"
                  />
                  <Animated.View style={styles.tokenContainer}>
                    <Animated.Image 
                      source={{ uri: imageUri }} 
                      style={[
                        styles.tokenImage,
                        {
                          transform: [{ scale: tokenScale }]
                        }
                      ]} 
                      resizeMode="cover"
                    />
                  </Animated.View>
                </Animated.View>
              </PinchGestureHandler>
              
              {/* Pagination Dots */}
              <View style={styles.paginationDots}>
                <View style={[styles.dot, styles.dotInactive]} />
                <View style={[styles.dot, styles.dotActive]} />
                <View style={[styles.dot, styles.dotInactive]} />
              </View>
              
              {/* Use Image Button */}
              <TouchableOpacity style={styles.useImageButton} onPress={onUseImage}>
                <Text style={styles.useImageButtonText}>Use Image</Text>
              </TouchableOpacity>
              
              {/* Description */}
              <Text style={styles.description}>Hat preview — exact look</Text>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hatPreviewContainer: {
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
  radialBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  instructionIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
  },
  hatContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    paddingHorizontal: 40, // Add padding to expand gesture area
    paddingVertical: 30,   // Add padding to expand gesture area
  },
  pinchingActive: {
    backgroundColor: 'rgba(0, 206, 209, 0.1)', // Subtle highlight when pinching
    borderRadius: 20,
  },
  hatImage: {
    width: 200,
    height: 150,
  },
  tokenContainer: {
    position: 'absolute',
    top: 50, // Adjusted for padding (20 + 30 padding)
    left: '50%',
    marginLeft: 11.5, // Moved 2px to the right (9.5 + 2 = 11.5)
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  dotInactive: {
    backgroundColor: '#333',
  },
  useImageButton: {
    backgroundColor: '#00CED1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
    minWidth: 120,
  },
  useImageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});
