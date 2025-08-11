import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const LatestDropsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Background Image with Woman and White Baseball Cap */}
      <Image
        source={require('../../../assets/LatestDropsImage.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Dark Overlay for Better Text Visibility */}
      <View style={styles.overlay} />
      
      {/* Content Overlay */}
      <View style={styles.contentContainer}>
        {/* LATEST DROPS Text */}
        <View style={styles.textContainer}>
          <Text style={styles.latestText}>LATEST</Text>
          <Text style={styles.dropsText}>DROPS</Text>
        </View>
        
        {/* Explore Button */}
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 350, // Reduced from 500 to 350
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for better text visibility
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 25, // Reduced from 30 to 25
    justifyContent: 'space-between', // Space between text and button
  },
  textContainer: {
    marginTop: 40, // Reduced from 60 to 40
  },
  latestText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System', // You can replace with a custom handwritten font
    letterSpacing: 2,
    marginBottom: 8,
  },
  dropsText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System', // You can replace with a custom handwritten font
    letterSpacing: 2,
  },
  exploreButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: 'flex-start', // Position at left
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  exploreButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
