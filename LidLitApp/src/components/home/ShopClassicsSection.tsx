import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const classicTokens = [
  {
    id: '1',
    name: 'Cleveland Cavaliers',
    image: require('../../../assets/ClevelandCavaliersToken.png'),
  },
  {
    id: '2',
    name: 'Los Angeles Lakers',
    image: require('../../../assets/LakersToken.png'),
  },
  {
    id: '3',
    name: 'Classic Token',
    image: require('../../../assets/token3.png'),
  },
];

export const ShopClassicsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Shop Classics</Text>
      
      {/* Tokens Carousel */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tokensContainer}
      >
        {classicTokens.map((token) => (
          <View key={token.id} style={styles.tokenCard}>
            {/* Heart Icon (Favorite) */}
            <View style={styles.heartIcon}>
              <Text style={styles.heartSymbol}>♡</Text>
            </View>
            
            {/* Token Image */}
            <Image
              source={token.image}
              style={styles.tokenImage}
              resizeMode="contain"
            />
            
            {/* Token Name */}
            <Text style={styles.tokenName}>{token.name}</Text>
          </View>
        ))}
      </ScrollView>
      
      {/* View All Button */}
      <View style={styles.viewAllContainer}>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllButtonText}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B0B0B',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'left',
  },
  tokensContainer: {
    paddingHorizontal: 20,
  },
  tokenCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 8,
    width: 200,
    height: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  viewAllContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  viewAllButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  viewAllButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
