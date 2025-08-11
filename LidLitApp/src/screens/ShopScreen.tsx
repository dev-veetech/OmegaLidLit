import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const ShopScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('S/M');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image Section with Radial Background */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/hat.png')}
              style={styles.productImage}
              resizeMode="contain"
            />
            
            {/* Image Carousel Indicators */}
            <View style={styles.carouselIndicators}>
              <View style={[styles.indicator, styles.indicatorInactive]} />
              <View style={[styles.indicator, styles.indicatorActive]} />
              <View style={[styles.indicator, styles.indicatorInactive]} />
            </View>
          </View>
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsSection}>
          {/* Product Name */}
          <Text style={styles.productName}>Swappable Magnetic Front Plate</Text>
          
          {/* Product Description */}
          <Text style={styles.productDescription}>
            Moisture-wicking 5.6 oz polyester/spandex cap with a smooth, stretchy front panel for all-day comfort. Features a mid-profile fit, lightly structured front and unstructured back.
          </Text>

          {/* Color Selection */}
          <View style={styles.selectionGroup}>
            <Text style={styles.selectionLabel}>Color:</Text>
            <View style={styles.colorButtons}>
              <TouchableOpacity
                style={[
                  styles.colorButton,
                  selectedColor === 'Black' && styles.colorButtonSelected
                ]}
                onPress={() => setSelectedColor('Black')}
              >
                <Text style={[
                  styles.colorButtonText,
                  selectedColor === 'Black' && styles.colorButtonTextSelected
                ]}>
                  Black
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.colorButton,
                  selectedColor === 'White' && styles.colorButtonSelected
                ]}
                onPress={() => setSelectedColor('White')}
              >
                <Text style={[
                  styles.colorButtonText,
                  selectedColor === 'White' && styles.colorButtonTextSelected
                ]}>
                  White
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Size Selection */}
          <View style={styles.selectionGroup}>
            <View style={styles.sizeLabelContainer}>
              <Text style={styles.selectionLabel}>Size:</Text>
              <TouchableOpacity style={styles.infoButton}>
                <Text style={styles.infoIcon}>i</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sizeButtons}>
              <TouchableOpacity
                style={[
                  styles.sizeButton,
                  selectedSize === 'S/M' && styles.sizeButtonSelected
                ]}
                onPress={() => setSelectedSize('S/M')}
              >
                <Text style={[
                  styles.sizeButtonText,
                  selectedSize === 'S/M' && styles.sizeButtonTextSelected
                ]}>
                  S/M
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.sizeButton,
                  selectedSize === 'L/XL' && styles.sizeButtonSelected
                ]}
                onPress={() => setSelectedSize('L/XL')}
              >
                <Text style={[
                  styles.sizeButtonText,
                  selectedSize === 'L/XL' && styles.sizeButtonTextSelected
                ]}>
                  L/XL
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('TokenSelection' as never)}>
            <Text style={styles.nextButtonText}>Next</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  imageContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 30,
    padding: 30,
    paddingTop: 50,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: width * 0.9,
    height: 200,
    marginBottom: 8,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#000',
  },
  indicatorInactive: {
    backgroundColor: '#ccc',
  },
  detailsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    lineHeight: 22,
  },
  productDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 24,
  },
  selectionGroup: {
    marginBottom: 18,
  },
  selectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  sizeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  infoButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginTop: 4,
  },
  infoIcon: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  colorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  colorButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  colorButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  colorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  colorButtonTextSelected: {
    color: '#fff',
  },
  sizeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonSelected: {
    backgroundColor: '#000',
  },
  sizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  sizeButtonTextSelected: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 16,
    width: 318,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
