import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const TokenFinalizationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [tokenName, setTokenName] = useState('');
  const [savedTokenName, setSavedTokenName] = useState('');
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [nfcLink, setNfcLink] = useState('');
  const inputRef = useRef<TextInput>(null);
  const nfcInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus the input after a short delay to ensure the screen is fully rendered
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (tokenName.trim()) {
      setSavedTokenName(tokenName);
      console.log('Token name saved:', tokenName);
      // Close keyboard
      inputRef.current?.blur();
    }
  };

  const handleSaveNfcLink = () => {
    if (nfcLink.trim()) {
      console.log('NFC link saved:', nfcLink);
      // Here you would typically save the NFC link to your backend
      // Close keyboard
      nfcInputRef.current?.blur();
    }
  };

  const handleProceedToCheckout = () => {
    // Navigate to checkout
    console.log('Proceeding to checkout');
    navigation.navigate('OrderSummary', {
      isHatFlow: false,
      tokenName: savedTokenName,
      nfcEnabled,
      nfcLink: nfcEnabled ? nfcLink : undefined,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>You're almost done</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Token Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Name your token"
            placeholderTextColor="#999"
            value={tokenName}
            onChangeText={setTokenName}
            returnKeyType="done"
          />
          <View style={styles.divider} />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Information Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Let others tap your token and unlock content — a photo, video, link, or anything you choose.
          </Text>
          <Image
            source={require('../../assets/NFCBanner.png')}
            style={styles.infoImage}
            resizeMode="contain"
          />
        </View>

        {/* NFC Section */}
        <View style={styles.nfcSection}>
          <View style={styles.nfcHeader}>
            <Text style={styles.nfcTitle}>NFC</Text>
            <Switch
              value={nfcEnabled}
              onValueChange={setNfcEnabled}
              trackColor={{ false: '#ddd', true: '#34C759' }}
              thumbColor={nfcEnabled ? '#fff' : '#fff'}
            />
          </View>
          <Text style={styles.nfcDescription}>
            You can update or disable NFC sharing anytime from your profile. Your badge still works without it.
          </Text>
        </View>

        {/* NFC Link Input - Only show when NFC is enabled */}
        {nfcEnabled && (
          <View style={styles.nfcLinkContainer}>
            <View style={styles.nfcLinkContent}>
              <View style={styles.nfcIconContainer}>
                <Image
                  source={require('../../assets/NFCExperience.png')}
                  style={styles.nfcIcon}
                  resizeMode="contain"
                />
              </View>
              <TextInput
                ref={nfcInputRef}
                style={styles.nfcLinkInput}
                value={nfcLink}
                onChangeText={setNfcLink}
                placeholder="Enter your website or social media link"
                placeholderTextColor="#999"
              />
              <View style={styles.verticalDivider} />
              <TouchableOpacity style={styles.nfcSaveButton} onPress={handleSaveNfcLink}>
                <Text style={styles.nfcSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Proceed Button - Always show but with different states */}
        <TouchableOpacity 
          style={[
            styles.proceedButton, 
            savedTokenName ? styles.proceedButtonEnabled : styles.proceedButtonDisabled
          ]} 
          onPress={handleProceedToCheckout}
          disabled={!savedTokenName}
        >
          <Text style={[
            styles.proceedButtonText,
            savedTokenName ? styles.proceedButtonTextEnabled : styles.proceedButtonTextDisabled
          ]}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 60,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    fontSize: 20,
    marginRight: 12,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 12,
  },
  saveButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    marginRight: 16,
  },
  infoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nfcSection: {
    marginBottom: 16,
  },
  nfcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nfcTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#333',
  },
  nfcDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  proceedButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#EDEDED',
  },
  proceedButtonEnabled: {
    backgroundColor: '#000000',
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButtonTextDisabled: {
    color: '#BBBBBB',
  },
  proceedButtonTextEnabled: {
    color: '#FFFFFF',
  },
  // NFC Link Input Styles - Exact match from TokenDetailScreen
  nfcLinkContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#F0F0F0',
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  nfcLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  nfcIconContainer: {
    marginRight: 8,
  },
  nfcIcon: {
    width: 28,
    height: 28,
  },
  nfcLinkInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 6,
    paddingLeft: 8,
    minHeight: 36,
    marginRight: 8,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
    alignSelf: 'center',
  },
  nfcSaveButton: {
    padding: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  nfcSaveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
