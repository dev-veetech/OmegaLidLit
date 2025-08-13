import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleMyOrders = () => {
    navigation.navigate('MyOrders' as never);
  };

  const handleMyTokens = () => {
    navigation.navigate('MyTokens' as never);
  };

  const handleMyFavs = () => {
    navigation.navigate('MyFavs' as never);
  };

  const handleMyDrafts = () => {
    navigation.navigate('MyDrafts' as never);
  };

  const handleAddUsername = () => {
    console.log('Add Username pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <Image
                source={require('../../assets/User.png')}
                style={styles.profileIcon}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Image
                source={require('../../assets/cameraIcon.png')}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Username */}
          <Text style={styles.username}>Omega_user_110</Text>

          {/* Add Username Button */}
          <TouchableOpacity style={styles.addUsernameButton} onPress={handleAddUsername}>
            <Text style={styles.addUsernameText}>Add Username</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleMyOrders}>
            <Text style={styles.menuText}>My Orders</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.menuItem} onPress={handleMyTokens}>
            <Text style={styles.menuText}>My Tokens</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.menuItem} onPress={handleMyFavs}>
            <Text style={styles.menuText}>My Favs</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.menuItem} onPress={handleMyDrafts}>
            <Text style={styles.menuText}>My Drafts</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
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
    borderBottomColor: '#007AFF',
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
  profileSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 60,
    height: 60,
    tintColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  addUsernameButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addUsernameText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
});
