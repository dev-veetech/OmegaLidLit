import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS } from '../../config/fonts';

const { width } = Dimensions.get('window');

interface HeroSectionProps {
  onShopPress: () => void;
  onCreatePress: () => void;
  onExplorePress: () => void;
  onStripeTestPress: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopPress,
  onCreatePress,
  onExplorePress,
  onStripeTestPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Hero Image Container */}
      <View style={styles.heroImageContainer}>
        <Image
          source={require('../../../assets/HeroSection.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        {/* Logo - Top Left */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>InfiniFits</Text>
        </View>
        
        {/* Text Overlay - Centered at Bottom */}
        <View style={styles.textOverlay}>
          <Text style={styles.mainSlogan}>SNAP. TAP. CREATE.</Text>
          <Text style={styles.subSlogan}>Transform your hat into a digital canvas</Text>
        </View>
      </View>

      {/* Navigation Sections - Full Width Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={onShopPress}>
          <LinearGradient
            colors={['#191919', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}
          >
            <View style={styles.navContent}>
              <Text style={styles.navTitle}>Shop</Text>
              <Image
                source={require('../../../assets/ShopHatIcon.png')}
                style={styles.navImage}
                resizeMode="cover"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onCreatePress}>
          <LinearGradient
            colors={['#191919', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}
          >
            <View style={styles.navContent}>
              <Text style={styles.navTitle}>Create</Text>
              <Image
                source={require('../../../assets/LakersToken.png')}
                style={styles.navImage}
                resizeMode="cover"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onExplorePress}>
          <LinearGradient
            colors={['#191919', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}
          >
            <View style={styles.navContent}>
              <Text style={styles.navTitle}>Explore</Text>
              <Image
                source={require('../../../assets/ExploreImage.png')}
                style={styles.navImage}
                resizeMode="cover"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onStripeTestPress}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}
          >
            <View style={styles.navContent}>
              <Text style={styles.navTitle}>🧪 Test Payments</Text>
              <Text style={styles.navSubtitle}>Stripe Integration</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroImageContainer: {
    position: 'relative',
    height: 600,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: 600,
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
    fontFamily: FONTS.ROCK_SALT,
  },
  subSlogan: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  navigationContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 0,
    marginTop: 0,
  },
  navButton: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  gradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  navTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONTS.ROCK_SALT,
  },
  navSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    fontFamily: FONTS.ROCK_SALT,
  },
  navImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});
