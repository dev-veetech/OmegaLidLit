import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { TokenSelectionScreen } from './src/screens/TokenSelectionScreen';
import { OrderSummaryScreen } from './src/screens/OrderSummaryScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OrderConfirmationScreen } from './src/screens/OrderConfirmationScreen';
import { BottomNavBar } from './src/components/navigation/BottomNavBar';
import { CreateTokenDrawer } from './src/components/CreateTokenDrawer';

const Stack = createNativeStackNavigator();

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  const handleCreatePress = () => {
    setShowCreateDrawer(true);
  };

  const handleCloseCreateDrawer = () => {
    setShowCreateDrawer(false);
  };

  const handleUseAI = () => {
    console.log('Use AI Magic pressed');
    setShowCreateDrawer(false);
  };

  const handleUploadPhoto = () => {
    console.log('Upload Photo pressed');
    setShowCreateDrawer(false);
  };

  const handleTakePhoto = () => {
    console.log('Take Photo pressed');
    setShowCreateDrawer(false);
  };

  return (
    <NavigationContainer>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Shop" component={ShopScreen} />
                    <Stack.Screen name="TokenSelection" component={TokenSelectionScreen} />
                    <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
                  </Stack.Navigator>
      
                        <BottomNavBar
                    activeTab={activeTab}
                    onTabPress={setActiveTab}
                    onCreatePress={handleCreatePress}
                  />

                  {/* Global Create Token Drawer */}
                  <CreateTokenDrawer
                    visible={showCreateDrawer}
                    onClose={handleCloseCreateDrawer}
                    onUseAI={handleUseAI}
                    onUploadPhoto={handleUploadPhoto}
                    onTakePhoto={handleTakePhoto}
                  />
                </NavigationContainer>
              );
            }
