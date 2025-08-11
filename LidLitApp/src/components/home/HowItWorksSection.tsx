import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const steps = [
  {
    id: '1',
    title: 'Step 1',
    image: require('../../../assets/step1.png'),
    heading: 'Choose Your Base Hat',
    description: 'Start with our magnetic-snapback hat.',
  },
  {
    id: '2',
    title: 'Step 2',
    image: require('../../../assets/step2.png'),
    heading: 'Design Your Token',
    description: 'Upload an image or use AI to generate your design.',
  },
  {
    id: '3',
    title: 'Step 3',
    image: require('../../../assets/step3.png'),
    heading: 'Snap It On',
    description: 'Your 3D-printed token clicks into place magnetically.',
  },
  {
    id: '4',
    title: 'Step 4',
    image: require('../../../assets/step4.png'),
    heading: 'Tap. Watch. Share.',
    description: 'Tap the token with phone to reveal video or image.',
  },
  {
    id: '5',
    title: 'Get Yours Now',
    image: null,
    heading: 'Get Yours Now',
    description: '',
    isGetYours: true,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
      
      {/* Steps Carousel */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepsContainer}
      >
        {steps.map((step) => (
          <View key={step.id} style={styles.stepCard}>
            {step.isGetYours ? (
              // Get Yours Now Content
              <>
                <Text style={styles.getYoursTitle}>{step.heading}</Text>
                
                <View style={styles.productOption}>
                  <Image
                    source={require('../../../assets/ShopHatIcon.png')}
                    style={styles.productIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.productText}>Custom Hat</Text>
                </View>
                
                <Text style={styles.plusSign}>+</Text>
                
                <View style={styles.productOption}>
                  <Image
                    source={require('../../../assets/LakersToken.png')}
                    style={styles.productIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.productText}>Starter Token</Text>
                </View>
                
                <Text style={styles.plusSign}>+</Text>
                
                <View style={styles.productOption}>
                  <View style={styles.customTokenIcon}>
                    <Text style={styles.tokenIconText}>▼</Text>
                  </View>
                  <View style={styles.customTokenTextContainer}>
                    <Text style={styles.productText}>Custom Token</Text>
                    <Text style={styles.subText}>Create token in app</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Buy $59.99</Text>
                </TouchableOpacity>
                
                <Text style={styles.shippingText}>Free 3-Day Shipping</Text>
              </>
            ) : (
              // Regular Step Content
              <>
                <Text style={styles.stepNumber}>{step.title}</Text>
                <Image
                  source={step.image}
                  style={styles.stepImage}
                  resizeMode="contain"
                />
                <Text style={styles.stepHeading}>{step.heading}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  stepsContainer: {
    paddingHorizontal: 20,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    marginBottom: 20, // Add bottom margin to prevent card clipping
    width: 280,
    minHeight: 400, // Ensure enough height to prevent clipping
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'flex-start', // Left align content
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    alignSelf: 'flex-start', // Left align
  },
  stepImage: {
    width: 160, // Bigger images
    height: 160, // Bigger images
    marginBottom: 20,
    alignSelf: 'center', // Center the image
  },
  stepHeading: {
    fontSize: 22, // Bigger heading
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left', // Left align
    marginBottom: 12,
    alignSelf: 'flex-start', // Left align
  },
  stepDescription: {
    fontSize: 16, // Slightly bigger description
    color: '#666',
    textAlign: 'left', // Left align
    lineHeight: 24,
    alignSelf: 'flex-start', // Left align
  },
  getYoursTitle: {
    fontSize: 24, // Bigger title
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    alignSelf: 'flex-start', // Left align
  },
  productOption: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from center to flex-start
    marginBottom: 12,
    width: '100%',
    alignSelf: 'flex-start', // Left align
  },
  productIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    marginTop: 2, // Add small top margin for alignment
  },
  customTokenIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2, // Add small top margin for alignment
  },
  tokenIconText: {
    fontSize: 12,
    color: '#ccc',
  },
  productText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  plusSign: {
    fontSize: 18,
    color: '#ccc',
    marginVertical: 8,
    alignSelf: 'flex-start', // Left align
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4, // Space between Custom Token and Create token in app
    alignSelf: 'flex-start', // Left align
  },
  buyButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
    width: '100%',
    alignSelf: 'center', // Center the button
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shippingText: {
    fontSize: 14, // Increased from 12 to 14
    color: '#666',
    marginTop: 12,
    alignSelf: 'center', // Center the text
    textAlign: 'center', // Center the text content
  },
  customTokenTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
});
