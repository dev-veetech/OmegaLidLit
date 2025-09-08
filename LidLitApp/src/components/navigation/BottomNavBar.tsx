import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../../config/fonts';

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  onCreatePress: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress,
  onCreatePress,
}) => {
  const navigation = useNavigation();

  const handleTabPress = (tabKey: string) => {
    if (tabKey === 'home') {
      // Navigate back to home screen
      onTabPress('home');
      navigation.navigate('Home' as never);
    } else if (tabKey === 'explore') {
      // When explore is pressed, navigate to explore screen
      onTabPress('explore');
      navigation.navigate('Explore' as never);
    } else if (tabKey === 'bag') {
      // When bag is pressed, navigate to shop and switch to bag tab
      onTabPress('bag');
      navigation.navigate('Shop' as never);
    } else if (tabKey === 'create') {
      // When create is pressed, show the create token drawer
      onCreatePress();
    } else if (tabKey === 'you') {
      // When you is pressed, navigate to profile screen
      onTabPress('you');
      navigation.navigate('Profile' as never);
    } else {
      onTabPress(tabKey);
    }
  };

  const tabs = [
    { key: 'home', label: 'Home', icon: require('../../../assets/home.png') },
    { key: 'explore', label: 'Explore', icon: require('../../../assets/explore.png') },
    { key: 'create', label: '', icon: require('../../../assets/Create.png') },
    { key: 'bag', label: 'Bag', icon: require('../../../assets/bag.png') },
    { key: 'you', label: 'You', icon: require('../../../assets/you.png') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              tab.key === 'create' && styles.centerTab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => handleTabPress(tab.key)}
          >
            <Image
              source={tab.icon}
              style={[
                tab.key === 'create' ? styles.centerIcon : styles.icon,
                activeTab === tab.key && (tab.key === 'create' ? styles.activeCenterIcon : styles.activeIcon),
              ]}
              resizeMode="contain"
            />
            {tab.label && (
              <Text style={[
                styles.label,
                activeTab === tab.key && styles.activeLabel,
              ]}>
                {tab.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
    paddingTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 60,
  },
  centerTab: {
    transform: [{ translateY: -15 }],
  },
  activeTab: {
    // Active tab styling
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: '#666',
    alignSelf: 'center',
  },
  centerIcon: {
    width: 60,
    height: 60,
    marginBottom: 0,
    alignSelf: 'center',
  },
  activeCenterIcon: {
    // No tint color - use original icon colors
  },
  activeIcon: {
    tintColor: '#000',
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    fontFamily: FONTS.ROCK_SALT,
  },
  activeLabel: {
    color: '#000',
    fontWeight: '600',
    fontFamily: FONTS.ROCK_SALT,
  },
});
