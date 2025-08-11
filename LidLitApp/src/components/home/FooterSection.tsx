import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export const FooterSection: React.FC = () => {
  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Top Section - White Background */}
      <View style={styles.topSection}>
        <View style={styles.trustSection}>
          <Image
            source={require('../../../assets/GreenStar.png')}
            style={styles.starIcon}
            resizeMode="contain"
          />
          <Text style={styles.trustText}>Trusted by 1K+ hat lovers</Text>
        </View>

        <Text style={styles.socialText}>As seen on TikTok, Instagram, YouTube</Text>

        <View style={styles.socialIcons}>
          <TouchableOpacity 
            style={styles.socialIconContainer}
            onPress={() => openURL('https://tiktok.com')}
          >
            <Image
              source={require('../../../assets/TikTokIcon.png')}
              style={[styles.socialIcon, { width: 40, height: 40 }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialIconContainer}
            onPress={() => openURL('https://instagram.com')}
          >
            <Image
              source={require('../../../assets/InstagramIcon.png')}
              style={[styles.socialIcon, { width: 45, height: 45 }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialIconContainer}
            onPress={() => openURL('https://youtube.com')}
          >
            <Image
              source={require('../../../assets/YoutubeIcon.png')}
              style={[styles.socialIcon, { width: 55, height: 55 }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Middle Section - Beige Background with Banner */}
      <View style={styles.middleSection}>
        <Image
          source={require('../../../assets/FreeUSShippingBanner.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Section - White Background */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.signInContainer}>
          <Text style={styles.signInText}>Already a creator? <Text style={styles.underlineText}>Sign in</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  topSection: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  trustSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  trustText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  socialText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
  },
  socialIcons: {
    flexDirection: 'row',
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconContainer: {
    width: 60,
    height: 60,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
  middleSection: {
    backgroundColor: '#f5f5dc', // Light beige background
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  bannerImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  bottomSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  signInContainer: {
    paddingVertical: 8,
  },
  signInText: {
    fontSize: 14,
    color: '#000',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
});
