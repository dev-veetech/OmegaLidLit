import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const TokenSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const nbaTokens = [
    {
      id: '1',
      name: 'Cleveland Cavaliers',
      image: require('../../assets/ClevelandCavaliersToken.png'),
      isSelected: selectedToken === '1',
    },
    {
      id: '2',
      name: 'Los Angeles Lakers',
      image: require('../../assets/LakersToken.png'),
      isSelected: selectedToken === '2',
    },
  ];

  const nflTokens = [
    {
      id: '3',
      name: 'Indiana Pacers',
      image: require('../../assets/Token4.png'),
      isSelected: selectedToken === '3',
    },
    {
      id: '4',
      name: 'Houston Rockets',
      image: require('../../assets/token3.png'),
      isSelected: selectedToken === '4',
    },
  ];

  const handleTokenSelect = (tokenId: string) => {
    setSelectedToken(tokenId);
  };

  const handleNext = () => {
    if (selectedToken) {
      // Navigate to Order Summary screen
      navigation.navigate('OrderSummary' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image Section with Radial Background */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/hat.png')}
              style={styles.productImage}
              resizeMode="contain"
            />
            
            {/* Image Carousel Indicators */}
            <View style={styles.carouselIndicators}>
              <View style={[styles.indicator, styles.indicatorInactive]} />
              <View style={[styles.indicator, styles.indicatorActive]} />
              <View style={[styles.indicator, styles.indicatorInactive]} />
            </View>
          </View>
        </View>

        {/* NBA Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NBA</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tokensContainer}
          >
            {nbaTokens.map((token) => (
              <TouchableOpacity
                key={token.id}
                style={[
                  styles.tokenCard,
                  token.isSelected && styles.tokenCardSelected
                ]}
                onPress={() => handleTokenSelect(token.id)}
              >
                {/* Heart Icon */}
                <View style={styles.heartIcon}>
                  <Text style={styles.heartSymbol}>♡</Text>
                </View>
                
                {/* Token Image */}
                <Image
                  source={token.image}
                  style={styles.tokenImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* NFL Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NFL</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tokensContainer}
          >
            {nflTokens.map((token) => (
              <TouchableOpacity
                key={token.id}
                style={[
                  styles.tokenCard,
                  token.isSelected && styles.tokenCardSelected
                ]}
                onPress={() => handleTokenSelect(token.id)}
              >
                {/* Heart Icon */}
                <View style={styles.heartIcon}>
                  <Text style={styles.heartSymbol}>♡</Text>
                </View>
                
                {/* Token Image */}
                <Image
                  source={token.image}
                  style={styles.tokenImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Next Button - Floating at Bottom - Only Visible When Token Selected */}
      {selectedToken && (
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 30,
    padding: 40,
    paddingTop: 60,
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: width * 0.8,
    height: 300,
    marginBottom: 10,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#000',
  },
  indicatorInactive: {
    backgroundColor: '#ccc',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  tokensContainer: {
    paddingHorizontal: 20,
  },
  tokenCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 8,
    marginBottom: 20,
    width: 160,
    height: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tokenCardSelected: {
    borderColor: '#000',
    borderWidth: 2,
  },
  heartIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartSymbol: {
    fontSize: 18,
    color: '#ccc',
  },
  tokenImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  bottomSpacing: {
    height: 80,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 90,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
    width: 318,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
