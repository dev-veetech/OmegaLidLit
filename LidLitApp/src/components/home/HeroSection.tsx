import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const HeroSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../../assets/HeroSection.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Logo - Top Left */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Omega</Text>
      </View>
      
      {/* Text Overlay - Centered at Bottom */}
      <View style={styles.textOverlay}>
        <Text style={styles.mainSlogan}>SNAP. TAP. CREATE.</Text>
        <Text style={styles.subSlogan}>Transform your hat into a digital canvas</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 600,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  logoContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainSlogan: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  subSlogan: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
});
