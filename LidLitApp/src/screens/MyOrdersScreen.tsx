import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const MyOrdersScreen: React.FC = () => {
  const navigation = useNavigation();

  const orders = [
    {
      id: '21612891212',
      status: 'Shipped',
      items: [
        {
          id: '1',
          name: 'Custom Hat',
          details: 'Size: M | Color: Black',
          price: '$59.99',
          quantity: 'Qty: 1',
          image: require('../../assets/hat.png'),
        },
        {
          id: '2',
          name: 'Cavaliers',
          details: 'Starter Token',
          price: 'Free',
          quantity: 'Qty: 1',
          image: require('../../assets/ClevelandCavaliersToken.png'),
        },
        {
          id: '3',
          name: 'Custom Token',
          details: 'Create your custom token in the app after purchase.',
          price: 'Free',
          quantity: 'Qty: 1',
          image: null, // Placeholder for custom token
        },
      ],
    },
    {
      id: '21612891213',
      status: 'Shipped',
      items: [
        {
          id: '4',
          name: 'Custom Hat',
          details: 'Size: M | Color: Black',
          price: '$59.99',
          quantity: 'Qty: 1',
          image: require('../../assets/hat.png'),
        },
        {
          id: '5',
          name: 'Cavaliers',
          details: 'Starter Token',
          price: 'Free',
          quantity: 'Qty: 1',
          image: require('../../assets/ClevelandCavaliersToken.png'),
        },
        {
          id: '6',
          name: 'Custom Token',
          details: 'Create your custom token in the app after purchase.',
          price: 'Free',
          quantity: 'Qty: 1',
          image: null, // Placeholder for custom token
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Order #{order.id}</Text>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>

            {/* Order Items */}
            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.itemImageContainer}>
                  {item.image ? (
                    <Image
                      source={item.image}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>+</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.details}</Text>
                </View>
                
                <View style={styles.itemPricing}>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <Text style={styles.itemQuantity}>{item.quantity}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
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
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
});
