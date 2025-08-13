import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  OrderSummary: {
    tokenName: string;
    nfcEnabled: boolean;
    nfcLink?: string;
  };
  OrderConfirmation: undefined;
};

type OrderSummaryScreenRouteProp = RouteProp<RootStackParamList, 'OrderSummary'>;

export const OrderSummaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<OrderSummaryScreenRouteProp>();
  const { tokenName, nfcEnabled, nfcLink } = route.params;

  const handleFreeCheckout = () => {
    console.log('Free checkout completed');
    // Navigate to order confirmation screen
    navigation.navigate('OrderConfirmation');
  };

  const handleEditShipping = () => {
    console.log('Edit shipping address');
    // Navigate to shipping address editing
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Order Summary</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.orderItem}>
            <View style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>Custom Token</Text>
              <Text style={styles.itemSubtext}>{tokenName}</Text>
            </View>
            <View style={styles.itemPrice}>
              <Text style={styles.priceText}>Free</Text>
              <Text style={styles.quantityText}>Qty: 1</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>--</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>5-Day Shipping:</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>--</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>$0.00</Text>
          </View>
        </View>

        {/* Ship to */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ship to</Text>
          <TouchableOpacity style={styles.shippingCard} onPress={handleEditShipping}>
            <View style={styles.shippingInfo}>
              <Text style={styles.shippingName}>John Appleseed</Text>
              <Text style={styles.shippingAddress}>27 Fredrick Butte Rd</Text>
              <Text style={styles.shippingCity}>Brothers OR 97712</Text>
              <Text style={styles.shippingCountry}>United States</Text>
            </View>
            <Text style={styles.editArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Free Checkout Button */}
      <View style={styles.checkoutButtonContainer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleFreeCheckout}>
          <Text style={styles.checkoutButtonText}>Free Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 24,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtext: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  shippingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  shippingInfo: {
    flex: 1,
  },
  shippingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  shippingAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  shippingCity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  shippingCountry: {
    fontSize: 14,
    color: '#666',
  },
  editArrow: {
    fontSize: 20,
    color: '#666',
    fontWeight: '300',
  },
  bottomSpacing: {
    height: 100,
  },
  checkoutButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 35,
    alignItems: 'center',
    minWidth: 200,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
