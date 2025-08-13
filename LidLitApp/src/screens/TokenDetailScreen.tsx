import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type TokenDetailRouteProp = RouteProp<{
  TokenDetail: {
    tokenId: string;
    tokenName: string;
    tokenImage: any;
  };
}, 'TokenDetail'>;

export const TokenDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TokenDetailRouteProp>();
  const { tokenId, tokenName, tokenImage } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [nfcLink, setNfcLink] = useState('https://www.google.com');

  const tokenStats = {
    views: 1247,
    nfcTaps: 89,
    purchases: 12,
  };

  const handleViewNFCExperience = () => {
    console.log('View NFC Experience pressed');
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleBuy = () => {
    console.log('Buy pressed');
  };

  const handleSaveNfcLink = () => {
    if (nfcLink.trim()) {
      setIsEditing(false);
      Alert.alert('Success', 'NFC link updated');
    }
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
        {/* Token Detail Card */}
        <View style={styles.tokenDetailCard}>
          {/* Left Side - Token Image */}
          <View style={styles.tokenImageSection}>
            <Image
              source={tokenImage}
              style={styles.tokenImage}
              resizeMode="contain"
            />
            <Text style={styles.tokenSubtitle}>{tokenName} 2025</Text>
          </View>

          {/* Right Side - Statistics */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tokenStats.views}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tokenStats.nfcTaps}</Text>
              <Text style={styles.statLabel}>NFC Taps</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tokenStats.purchases}</Text>
              <Text style={styles.statLabel}>Purchases</Text>
            </View>
          </View>
        </View>

        {/* NFC Experience / Edit Button */}
        <View style={styles.nfcButton}>
          {isEditing ? (
            /* Edit Mode */
            <View style={styles.nfcButtonContent}>
              <View style={styles.nfcIconContainer}>
                <Image
                  source={require('../../assets/NFCExperience.png')}
                  style={styles.nfcIcon}
                  resizeMode="contain"
                />
              </View>
              <TextInput
                style={styles.nfcInput}
                value={nfcLink}
                onChangeText={setNfcLink}
                placeholder="Enter NFC link"
                placeholderTextColor="#999"
              />
              <View style={styles.verticalDivider} />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveNfcLink}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* View Mode */
            <TouchableOpacity style={styles.nfcButtonContent} onPress={handleViewNFCExperience}>
              <View style={styles.nfcIconContainer}>
                <Image
                  source={require('../../assets/NFCExperience.png')}
                  style={styles.nfcIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.nfcText}>View NFC Experience</Text>
              <View style={styles.verticalDivider} />
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Spacing for Buy Button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Buy Button */}
      <View style={styles.buyButtonContainer}>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </View>
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
  tokenDetailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tokenImageSection: {
    flex: 1,
    alignItems: 'center',
  },
  tokenImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  tokenSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  statsSection: {
    flex: 1,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginVertical: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: '80%',
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  nfcButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  nfcButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    flex: 1,
  },
  nfcIconContainer: {
    marginRight: 12,
  },
  nfcIcon: {
    width: 24,
    height: 24,
  },
  nfcText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingVertical: 8,
    paddingLeft: 8, // Add left padding to match input field
  },
  verticalDivider: {
    width: 1,
    height: 20, // More appropriate height
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
    alignSelf: 'center', // Center the divider vertically
  },
  editButton: {
    padding: 8,
  },
  editText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  nfcInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingLeft: 8, // Ensure left padding is consistent
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 100,
  },
  buyButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buyButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
