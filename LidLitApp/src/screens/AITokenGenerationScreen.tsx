import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import aiTokenService, { TokenGenerationRequest } from '../services/aiTokenService';
import { HatPreviewDrawer } from '../components/HatPreviewDrawer';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string; // Optional image URL for AI responses
  tokenId?: string; // Optional token ID for generated tokens
}

type RootStackParamList = {
  TokenPreview: {
    imageUrl: string;
    prompt: string;
    tokenId: string;
    isFirstToken: boolean;
  };
};

export const AITokenGenerationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI token creation assistant. I can help you design unique tokens based on your ideas. What kind of token would you like to create?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Hat preview drawer state
  const [showHatPreview, setShowHatPreview] = useState(false);
  const [selectedTokenImage, setSelectedTokenImage] = useState<string>('');

  const starterPrompts = [
    "Create a basketball-themed token with vibrant colors and dynamic energy",
    "Design a futuristic tech token with neon accents and geometric patterns"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Validate prompt
    const validation = aiTokenService.validatePrompt(text.trim());
    if (!validation.isValid) {
      Alert.alert('Invalid Prompt', validation.error);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Generate token using Seedream-3.0
      const generationRequest: TokenGenerationRequest = {
        prompt: text.trim(),
        aspect_ratio: '1:1', // Square for hat designs
        size: 'regular',
        width: 1024,
        height: 1024,
        guidance_scale: 3.0, // Higher guidance for better prompt adherence
      };

      const response = await aiTokenService.generateHatToken(text.trim());
      
      if (response.success && response.imageUrl) {
        // Success - show generated token in chat
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `🎨 Your custom token has been generated! I've created a unique design based on your description: "${text.trim()}". The token is optimized for hat printing with clear, bold graphics.`,
          isUser: false,
          timestamp: new Date(),
          imageUrl: response.imageUrl,
          tokenId: `token_${Date.now()}`
        };
        
        setMessages(prev => [...prev, aiResponse]);
        
        // No automatic navigation - user can click "Preview on hat" to see it on a hat
        
      } else {
        // Error occurred
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `❌ Sorry, I encountered an error while generating your token: ${response.error}. Please try again with a different description.`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error generating token:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ An unexpected error occurred. Please check your internet connection and try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Interface */}
      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
              
              {/* Display generated token image if available */}
              {message.imageUrl && (
                <View style={styles.tokenImageContainer}>
                  <Image 
                    source={{ uri: message.imageUrl }} 
                    style={styles.tokenImage}
                    resizeMode="contain"
                  />
                  <View style={styles.tokenActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => {
                        // Open hat preview drawer
                        setSelectedTokenImage(message.imageUrl!);
                        setShowHatPreview(true);
                      }}
                    >
                      <Text style={styles.actionButtonText}>Preview on hat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={() => {
                        // Save token action
                        Alert.alert('Save Token', 'Token saved to your collection!');
                      }}
                    >
                      <Text style={styles.saveButtonText}>Save for later</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
          
          {isLoading && (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <Text style={[styles.messageText, styles.aiMessageText]}>
                🎨 Generating your token... This may take a few moments.
              </Text>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Starter Prompts */}
        {messages.length === 1 && (
          <View style={styles.starterPromptsContainer}>
            <Text style={styles.starterPromptsTitle}>Try these starter prompts:</Text>
            {starterPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.starterPromptButton}
                onPress={() => handleStarterPrompt(prompt)}
              >
                <Text style={styles.starterPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Describe your idea"
              placeholderTextColor="#999"
              multiline
              maxLength={300}
            />
            <Text style={styles.wordCounter}>{inputText.split(/\s+/).filter(word => word.length > 0).length}/300 words</Text>
                         <TouchableOpacity 
               style={[
                 styles.magicWandButton, 
                 !inputText.trim() && styles.magicWandButtonDisabled
               ]}
               onPress={() => handleSendMessage(inputText)}
               disabled={!inputText.trim()}
               activeOpacity={1}
             >
                             <Image 
                 source={require('../../assets/GenUsingAI.png')} 
                 style={styles.magicWandIcon}
                 resizeMode="contain"
               />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Hat Preview Drawer */}
      <HatPreviewDrawer
        visible={showHatPreview}
        imageUri={selectedTokenImage}
        onClose={() => setShowHatPreview(false)}
        onUseImage={() => {
          setShowHatPreview(false);
          // Navigate to checkout page
          navigation.navigate('Checkout', {
            amount: 25.99, // Hat price
            productType: 'hatTokenCombo', // Hat + AI generated token combo
            productId: 'hat_ai_token_combo', // Product identifier
            description: 'Hat with AI Generated Token',
            metadata: {
              hatSize: 'M',
              hatColor: 'Black',
              selectedTokenName: 'AI Generated Token',
              tokenPrice: '0',
              hatPrice: '25.99',
            },
          });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageBubble: {
    maxWidth: '85%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 2,
    opacity: 0.6,
  },
  starterPromptsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  starterPromptsTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  starterPromptButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#555',
  },
  starterPromptText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    paddingVertical: 0,
    backgroundColor: '#0B0B0B',
  },
  textInputWrapper: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
    paddingRight: 80,
    fontSize: 16,
    color: '#fff',
    minHeight: 120,
    textAlignVertical: 'top',
    width: '100%',
  },
  wordCounter: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    fontSize: 12,
    color: '#999',
  },
  magicWandButton: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  magicWandButtonDisabled: {
    opacity: 0.5,
  },
  magicWandIcon: {
    width: 32,
    height: 32,
  },
  // Token image display styles
  tokenImageContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  tokenImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  tokenActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    // No background styling - just text
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
});
