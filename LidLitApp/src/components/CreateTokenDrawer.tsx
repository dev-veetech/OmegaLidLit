import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';

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
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        {/* Drawer */}
        <View style={styles.drawer}>
          {/* Handle */}
          <View style={styles.handle} />
          
          {/* Title */}
          <Text style={styles.title}>Create your token</Text>
          
          {/* Options */}
          <View style={styles.optionsContainer}>
            {/* Use AI Magic */}
            <TouchableOpacity style={styles.option} onPress={onUseAI}>
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
            <TouchableOpacity style={styles.option} onPress={onUploadPhoto}>
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
            <TouchableOpacity style={styles.option} onPress={onTakePhoto}>
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'left',
  },
  optionsContainer: {
    gap: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiIconContainer: {
    backgroundColor: '#4CAF50', // Green background for AI
  },
  uploadIconContainer: {
    backgroundColor: '#FF9800', // Orange background for upload
  },
  cameraIconContainer: {
    backgroundColor: '#2196F3', // Blue background for camera
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#fff',
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
