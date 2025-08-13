import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const MyFavsScreen: React.FC = () => {
  const navigation = useNavigation();

  const favorites = [
    {
      id: '1',
      name: 'Cleveland Cavaliers',
      image: require('../../assets/ClevelandCavaliersToken.png'),
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Los Angeles Lakers',
      image: require('../../assets/LakersToken.png'),
      isFavorite: true,
    },
  ];

  const toggleFavorite = (favoriteId: string) => {
    console.log('Toggle favorite for item:', favoriteId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favs</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.favoritesContainer}>
          {favorites.map((favorite) => (
            <View key={favorite.id} style={styles.favoriteCard}>
              {/* Heart Icon */}
              <TouchableOpacity 
                style={styles.heartButton}
                onPress={() => toggleFavorite(favorite.id)}
              >
                <Text style={styles.heartIcon}>❤️</Text>
              </TouchableOpacity>

              {/* Favorite Item Image */}
              <Image
                source={favorite.image}
                style={styles.favoriteImage}
                resizeMode="contain"
              />
            </View>
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
                favoritesContainer: {
                paddingHorizontal: 20,
                paddingTop: 20,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              },
              favoriteCard: {
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
    color: '#ff0000',
    fontWeight: 'bold',
  },
                favoriteImage: {
                width: (width - 60) / 2 - 32, // Card width minus padding
                height: (width - 60) / 2 - 32,
                maxWidth: 120,
                maxHeight: 120,
              },
});
