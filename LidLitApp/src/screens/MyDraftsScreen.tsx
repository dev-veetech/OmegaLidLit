import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const MyDraftsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const drafts = [
    {
      id: '1',
      name: 'Token 4',
      image: require('../../assets/Token4.png'),
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Token 3',
      image: require('../../assets/token3.png'),
      isFavorite: false,
    },
  ];

  const toggleFavorite = (draftId: string) => {
    console.log('Toggle favorite for draft:', draftId);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    console.log('Edit mode:', !isEditing);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Drafts</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.draftsContainer}>
          {drafts.map((draft) => (
            <View key={draft.id} style={styles.draftCard}>
              {/* Heart Icon */}
              <TouchableOpacity 
                style={styles.heartButton}
                onPress={() => toggleFavorite(draft.id)}
              >
                <Text style={styles.heartIcon}>♡</Text>
              </TouchableOpacity>

              {/* Draft Token Image */}
              <Image
                source={draft.image}
                style={styles.draftImage}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0,
    position: 'relative',
  },
  backButton: {
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
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  editText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  draftsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  draftCard: {
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
  draftImage: {
    width: (width - 60) / 2 - 32, // Card width minus padding
    height: (width - 60) / 2 - 32,
    maxWidth: 120,
    maxHeight: 120,
  },
});
