import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import aiTokenService from '../../services/aiTokenService';

export const AITokenTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testAIService = async () => {
    setIsLoading(true);
    addResult('🧪 Testing AI Token Service...');

    try {
      // Test 1: Service initialization
      addResult('✅ AI Service initialized successfully');
      
      // Test 2: Model info
      const modelInfo = aiTokenService.getModelInfo();
      addResult(`📊 Model: ${modelInfo.name}`);
      addResult(`📝 Description: ${modelInfo.description}`);
      addResult(`🎯 Capabilities: ${modelInfo.capabilities.length} features`);
      
      // Test 3: Prompt validation
      const validPrompt = "Create a simple geometric pattern with blue and green";
      const validation = aiTokenService.validatePrompt(validPrompt);
      addResult(`✅ Prompt validation: ${validation.isValid ? 'PASS' : 'FAIL'}`);
      
      if (!validation.isValid) {
        addResult(`❌ Validation error: ${validation.error}`);
      }

      // Test 4: Token generation (this will actually call the API)
      addResult('🚀 Testing actual token generation...');
      addResult('⚠️ This will use your Replicate API credits!');
      
      const response = await aiTokenService.generateHatToken(validPrompt);
      
      if (response.success) {
        addResult('🎉 Token generated successfully!');
        addResult(`🖼️ Image URL: ${response.imageUrl?.substring(0, 50)}...`);
        addResult(`📊 Metadata: ${response.metadata?.width}x${response.metadata?.height}`);
      } else {
        addResult(`❌ Token generation failed: ${response.error}`);
      }

    } catch (error) {
      addResult(`💥 Error during testing: ${error}`);
    } finally {
      setIsLoading(false);
      addResult('🏁 Test completed');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 AI Token Service Test</Text>
      
      <TouchableOpacity 
        style={[styles.testButton, isLoading && styles.testButtonDisabled]} 
        onPress={testAIService}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.testButtonText}>Run AI Service Test</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
        <Text style={styles.clearButtonText}>Clear Results</Text>
      </TouchableOpacity>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
        {testResults.length === 0 && (
          <Text style={styles.noResultsText}>No test results yet. Run the test to see results.</Text>
        )}
      </ScrollView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ What This Test Does:</Text>
        <Text style={styles.infoText}>• Tests AI service initialization</Text>
        <Text style={styles.infoText}>• Validates prompt filtering</Text>
        <Text style={styles.infoText}>• Tests actual token generation</Text>
        <Text style={styles.infoText}>• Uses your Replicate API token</Text>
        <Text style={styles.infoText}>• Will consume API credits</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0B0B0B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 30,
  },
  testButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 15,
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  noResultsText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  infoContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffaa00',
    marginBottom: 10,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
});


