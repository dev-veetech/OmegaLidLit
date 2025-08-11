import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeroSection } from '../components/home/HeroSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { LatestDropsSection } from '../components/home/LatestDropsSection';
import { ShopClassicsSection } from '../components/home/ShopClassicsSection';
import { SnapYourStyleSection } from '../components/home/SnapYourStyleSection';
import { TopPicksSection } from '../components/home/TopPicksSection';
import { DesignSection } from '../components/home/DesignSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FooterSection } from '../components/home/FooterSection';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleShopPress = () => {
    console.log('Shop pressed');
    navigation.navigate('Shop' as never);
  };

  const handleCreatePress = () => {
    console.log('Create pressed');
    // Navigate to create screen
  };

  const handleExplorePress = () => {
    console.log('Explore pressed');
    // Navigate to explore screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        
        <HowItWorksSection />
        
        <LatestDropsSection />
        
        <ShopClassicsSection />
        
        <SnapYourStyleSection />
        
        <TopPicksSection />
        
        <DesignSection />
        
        <TestimonialsSection />
        
        <FooterSection />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
});
