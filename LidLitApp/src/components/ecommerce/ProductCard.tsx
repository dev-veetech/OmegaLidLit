import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageSourcePropType, Image as RNImage } from 'react-native';

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: ImageSourcePropType;
  price?: number;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

const { width } = Dimensions.get('window');

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  imageUrl,
  price,
  onPress,
  size = 'medium',
}) => {
  const cardSize = size === 'small' ? 80 : size === 'medium' ? 120 : 160;
  
  return (
    <TouchableOpacity style={[styles.container, { width: cardSize, height: cardSize }]} onPress={onPress}>
      {imageUrl ? (
        <RNImage 
          source={imageUrl}
          style={[styles.image, { width: cardSize, height: cardSize }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, { width: cardSize, height: cardSize, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.placeholderText}>Hat</Text>
        </View>
      )}
      {price && (
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 8,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  price: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
