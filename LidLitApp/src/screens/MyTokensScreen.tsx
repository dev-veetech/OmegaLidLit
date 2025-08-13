import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const MyTokensScreen: React.FC = () => {
  const navigation = useNavigation();

  const tokens = [
    {
      id: '1',
      name: 'Cleveland Cavaliers',
      image: require('../../assets/ClevelandCavaliersToken.png'),
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Los Angeles Lakers',
      image: require('../../assets/LakersToken.png'),
      isFavorite: false,
    },
  ];

  const toggleFavorite = (tokenId: string) => {
    console.log('Toggle favorite for token:', tokenId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tokens</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.tokensContainer}>
          {tokens.map((token) => (
            <TouchableOpacity 
              key={token.id} 
              style={styles.tokenCard}
              onPress={() => navigation.navigate('TokenDetail' as never, {
                tokenId: token.id,
                tokenName: token.name,
                tokenImage: token.image,
              })}
            >
              {/* Heart Icon */}
              <TouchableOpacity 
                style={styles.heartButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(token.id);
                }}
              >
                <Text style={styles.heartIcon}>♡</Text>
              </TouchableOpacity>

              {/* Token Image */}
              <Image
                source={token.image}
                style={styles.tokenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  tokensContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tokenCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    width: (width - 60) / 2, // Two tiles per row with spacing
    minHeight: 150,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  heartIcon: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: 'bold',
  },
  tokenImage: {
    width: (width - 60) / 2 - 32, // Card width minus padding
    height: (width - 60) / 2 - 32,
    maxWidth: 120,
    maxHeight: 120,
  },
});
