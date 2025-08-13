import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export const ExploreScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('video');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLike = () => {
    console.log('Like pressed');
  };

  const handleShare = () => {
    console.log('Share pressed');
  };

  const handleAddToFavs = () => {
    console.log('Add to favs pressed');
  };

  return (
         <SafeAreaView style={[styles.container, activeTab === 'library' && styles.libraryContainerBg]}>
             {/* Header with Tabs */}
       <View style={[styles.header, activeTab === 'video' && styles.videoHeaderBg]}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'video' && styles.activeTab]}
            onPress={() => handleTabPress('video')}
          >
                         <Text style={[
               styles.tabText, 
               activeTab === 'video' ? styles.activeTabTextVideo : styles.inactiveTabTextVideo
             ]}>
               Video
             </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'library' && styles.activeTab]}
            onPress={() => handleTabPress('library')}
          >
                         <Text style={[
               styles.tabText, 
               activeTab === 'library' ? styles.activeTabTextLibrary : styles.inactiveTabTextLibrary
             ]}>
               Library
             </Text>
          </TouchableOpacity>
        </View>
      </View>

             {/* Main Content */}
       {activeTab === 'video' ? (
         /* Video Tab Content */
         <View style={styles.videoContainer}>
           <Image
             source={require('../../assets/ExploreSamplePost.png')}
             style={styles.videoImage}
             resizeMode="cover"
           />

           {/* Bottom Left - Token Info */}
           <View style={styles.tokenInfo}>
             <Text style={styles.tokenName}>Token name</Text>
             <Text style={styles.creatorName}>@username</Text>
           </View>

           {/* Bottom Right - Social Actions */}
           <View style={styles.socialActions}>
             <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
               <Image
                 source={require('../../assets/like.png')}
                 style={styles.actionIcon}
                 resizeMode="contain"
               />
               <Text style={styles.actionText}>200</Text>
             </TouchableOpacity>
             
             <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
               <Image
                 source={require('../../assets/share.png')}
                 style={styles.actionIcon}
                 resizeMode="contain"
               />
               <Text style={styles.actionText}>Share</Text>
             </TouchableOpacity>
             
             <TouchableOpacity style={styles.actionButton} onPress={handleAddToFavs}>
               <Image
                 source={require('../../assets/bookmark.png')}
                 style={styles.actionIcon}
                 resizeMode="contain"
               />
               <Text style={styles.actionText}>1.1k</Text>
             </TouchableOpacity>
           </View>

           {/* Add to Cart Button */}
           <TouchableOpacity style={styles.addToCartButton}>
             {/* BlurView for the glass effect */}
             <BlurView
               style={styles.blurView}
               intensity={20}
               tint="dark"
             />
             <Text style={styles.addToCartText}>Add to Cart</Text>
           </TouchableOpacity>
         </View>
       ) : (
         /* Library Tab Content */
                   <ScrollView 
            style={styles.libraryContainer} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
           {/* Latest Drops Section */}
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Latest Drops</Text>
             <View style={styles.tokenGrid}>
               <View style={styles.tokenCard}>
                 <TouchableOpacity style={styles.heartButton}>
                   <Text style={styles.heartIcon}>♡</Text>
                 </TouchableOpacity>
                 <Image
                   source={require('../../assets/ClevelandCavaliersToken.png')}
                   style={styles.tokenImage}
                   resizeMode="contain"
                 />
               </View>
               <View style={styles.tokenCard}>
                 <TouchableOpacity style={styles.heartButton}>
                   <Text style={styles.heartIcon}>♡</Text>
                 </TouchableOpacity>
                 <Image
                   source={require('../../assets/LakersToken.png')}
                   style={styles.tokenImage}
                   resizeMode="contain"
                 />
               </View>
             </View>
           </View>

           {/* NFL Section */}
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>NFL</Text>
             <View style={styles.tokenGrid}>
               <View style={styles.tokenCard}>
                 <TouchableOpacity style={styles.heartButton}>
                   <Text style={styles.heartIcon}>♡</Text>
                 </TouchableOpacity>
                 <Image
                   source={require('../../assets/Token4.png')}
                   style={styles.tokenImage}
                   resizeMode="contain"
                 />
               </View>
               <View style={styles.tokenCard}>
                 <TouchableOpacity style={styles.heartButton}>
                   <Text style={styles.heartIcon}>♡</Text>
                 </TouchableOpacity>
                 <Image
                   source={require('../../assets/token3.png')}
                   style={styles.tokenImage}
                   resizeMode="contain"
                 />
               </View>
             </View>
           </View>

                       {/* NBA Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>NBA</Text>
              <View style={styles.tokenGrid}>
                <View style={styles.tokenCard}>
                  <TouchableOpacity style={styles.heartButton}>
                    <Text style={styles.heartIcon}>♡</Text>
                  </TouchableOpacity>
                  <Image
                    source={require('../../assets/ClevelandCavaliersToken.png')}
                    style={styles.tokenImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.tokenCard}>
                  <TouchableOpacity style={styles.heartButton}>
                    <Text style={styles.heartIcon}>♡</Text>
                  </TouchableOpacity>
                  <Image
                    source={require('../../assets/LakersToken.png')}
                    style={styles.tokenImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>

            {/* Additional Section for More Content */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured</Text>
              <View style={styles.tokenGrid}>
                <View style={styles.tokenCard}>
                  <TouchableOpacity style={styles.heartButton}>
                    <Text style={styles.heartIcon}>♡</Text>
                  </TouchableOpacity>
                  <Image
                    source={require('../../assets/Token4.png')}
                    style={styles.tokenImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.tokenCard}>
                  <TouchableOpacity style={styles.heartButton}>
                    <Text style={styles.heartIcon}>♡</Text>
                  </TouchableOpacity>
                  <Image
                    source={require('../../assets/token3.png')}
                    style={styles.tokenImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
       )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Video tab text colors
  activeTabTextVideo: {
    color: '#FFFFFF',
  },
  inactiveTabTextVideo: {
    color: '#707070',
  },
  // Library tab text colors
  activeTabTextLibrary: {
    color: '#000000',
  },
  inactiveTabTextLibrary: {
    color: '#707070',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  tokenInfo: {
    position: 'absolute',
    bottom: 120,
    left: 20,
  },
  tokenName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  creatorName: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  socialActions: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingHorizontal: 32,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Crucial for borderRadius to clip BlurView
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle white border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 25, // Match parent borderRadius
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    zIndex: 1, // Ensure text is above BlurView
  },
  // Header Background Styles
  videoHeaderBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  // Library Tab Styles
  libraryContainerBg: {
    backgroundColor: '#FFFFFF',
  },
  libraryContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContentContainer: {
    paddingTop: 120, // Account for header
    paddingBottom: 20, // Reduced bottom padding
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  tokenGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tokenCard: {
    width: (width - 60) / 2, // Two cards per row with spacing
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  heartIcon: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: 'bold',
  },
  tokenImage: {
    width: '100%',
    height: 120,
    maxWidth: 120,
    maxHeight: 120,
    alignSelf: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});
