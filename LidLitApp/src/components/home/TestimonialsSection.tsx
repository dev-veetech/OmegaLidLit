import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const mockTestimonials = [
  {
    id: '1',
    name: '@michelle',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
    quote: 'Perfect for game day! My custom hat tokens were a huge hit.',
  },
  {
    id: '2',
    name: '@jake',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    quote: 'Love how easy it is to switch up my style with different tokens!',
  },
  {
    id: '3',
    name: '@sarah',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    quote: 'The quality is amazing and shipping was super fast.',
  },
  {
    id: '4',
    name: '@mike',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    quote: 'Best hat I\'ve ever owned. The magnetic system is genius!',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What Customers Are Saying..</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.testimonialsContainer}
      >
        {mockTestimonials.map((testimonial) => (
          <View key={testimonial.id} style={styles.testimonialCard}>
            <Image
              source={{ uri: testimonial.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.quote}>{testimonial.quote}</Text>
            <Text style={styles.name}>{testimonial.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 60, // Increased from 40 to 60 to prevent bottom clipping
    paddingHorizontal: 0, // Remove horizontal padding to prevent clipping
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20, // Add padding to heading instead
  },
  testimonialsContainer: {
    paddingHorizontal: 20, // Add padding to the scrollable content
    paddingBottom: 20, // Add bottom padding to prevent clipping
  },
  testimonialCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 16,
  },
  quote: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  name: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
