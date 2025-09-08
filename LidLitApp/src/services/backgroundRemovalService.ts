// Background Removal Service using Replicate API
export interface BackgroundRemovalRequest {
  imageUri: string;
  threshold?: number;
  reverse?: boolean;
  backgroundType?: string;
  format?: string;
}

export interface BackgroundRemovalResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    originalImageUri: string;
    processedAt: Date;
    threshold?: number;
    format?: string;
  };
}

class BackgroundRemovalService {
  private replicateToken: string = process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN || '';
  private modelName: string = '851-labs/background-remover';

  /**
   * Upload image to a temporary URL for Replicate processing
   */
  private async uploadImageForReplicate(imageUri: string): Promise<string> {
    console.log('📤 Uploading image for Replicate...');
    
    // If it's already a public URL, return it
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      return imageUri;
    }

    // Convert local image to base64 and create data URI
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('❌ Failed to convert image:', error);
      throw new Error('Failed to process image for upload');
    }
  }

  /**
   * Remove background from an image using Replicate API
   */
  async removeBackground(request: BackgroundRemovalRequest): Promise<BackgroundRemovalResponse> {
    try {
      console.log('🖼️ Starting background removal...');
      console.log('📷 Image URI:', request.imageUri);

      // Convert image to compatible format for Replicate
      const processedImageUri = await this.uploadImageForReplicate(request.imageUri);
      console.log('📤 Image processed for Replicate');

      // Create prediction
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.replicateToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc',
          input: {
            image: processedImageUri,
            threshold: request.threshold || 0,
            reverse: request.reverse || false,
            background_type: request.backgroundType || 'rgba',
            format: request.format || 'png',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Replicate API error: ${errorData.detail || 'Unknown error'}`);
      }

      const prediction = await response.json();
      console.log('🔄 Prediction created:', prediction.id);

      // Poll for completion
      const result = await this.waitForCompletion(prediction.id);

      if (result.status === 'succeeded' && result.output) {
        console.log('✅ Background removal completed successfully!');
        
        return {
          success: true,
          imageUrl: result.output,
          metadata: {
            originalImageUri: request.imageUri,
            processedAt: new Date(),
            threshold: request.threshold,
            format: request.format || 'png',
          },
        };
      } else if (result.status === 'failed') {
        throw new Error(`Background removal failed: ${result.error}`);
      } else {
        throw new Error('Background removal did not complete successfully');
      }
    } catch (error) {
      console.error('❌ Error removing background:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Poll the prediction until it's complete
   */
  private async waitForCompletion(predictionId: string, maxAttempts: number = 30): Promise<any> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${this.replicateToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction status');
      }

      const prediction = await response.json();
      
      if (prediction.status === 'succeeded' || prediction.status === 'failed') {
        return prediction;
      }

      console.log(`⏳ Waiting for completion... (${prediction.status})`);
      
      // Wait 2 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Background removal timed out');
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      name: '851-labs/background-remover',
      description: 'Remove backgrounds from images using transparent-background python package',
      capabilities: [
        'Background removal',
        'Foreground isolation',
        'Multiple output formats',
        'Adjustable threshold',
      ],
      supportedFormats: ['png', 'jpg'],
      website: 'https://emojis.com',
    };
  }
}

export default new BackgroundRemovalService();