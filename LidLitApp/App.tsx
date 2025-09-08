import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StripeProvider } from './src/components/providers/StripeProvider';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { TokenSelectionScreen } from './src/screens/TokenSelectionScreen';
import { OrderSummaryScreen } from './src/screens/OrderSummaryScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OrderConfirmationScreen } from './src/screens/OrderConfirmationScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MyOrdersScreen } from './src/screens/MyOrdersScreen';
import { MyTokensScreen } from './src/screens/MyTokensScreen';
import { MyFavsScreen } from './src/screens/MyFavsScreen';
import { MyDraftsScreen } from './src/screens/MyDraftsScreen';
import { TokenDetailScreen } from './src/screens/TokenDetailScreen';
import { AITokenGenerationScreen } from './src/screens/AITokenGenerationScreen';
import { ImageUploadPreviewScreen } from './src/screens/ImageUploadPreviewScreen';
import { PhotoEditingScreen } from './src/screens/PhotoEditingScreen';
import { TokenFinalizationScreen } from './src/screens/TokenFinalizationScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { StripeTestScreen } from './src/screens/StripeTestScreen';
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
    // Navigation will be handled by the CreateTokenDrawer component
  };

  const handleTakePhoto = () => {
    console.log('Take Photo pressed');
    setShowCreateDrawer(false);
  };

  return (
    <StripeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="TokenSelection" component={TokenSelectionScreen} />
          <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
          <Stack.Screen name="MyTokens" component={MyTokensScreen} />
          <Stack.Screen name="MyFavs" component={MyFavsScreen} />
          <Stack.Screen name="MyDrafts" component={MyDraftsScreen} />
          <Stack.Screen name="TokenDetail" component={TokenDetailScreen} />
          <Stack.Screen name="AITokenGeneration" component={AITokenGenerationScreen} />
          <Stack.Screen name="ImageUploadPreview" component={ImageUploadPreviewScreen} />
          <Stack.Screen name="PhotoEditing" component={PhotoEditingScreen} />
          <Stack.Screen name="TokenFinalization" component={TokenFinalizationScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="StripeTest" component={StripeTestScreen} />
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
    </StripeProvider>
  );
}
