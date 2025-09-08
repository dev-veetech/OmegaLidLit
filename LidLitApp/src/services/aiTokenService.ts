// AI Token Generation Service using OpenAI DALL-E
import { getAIConfig } from '../config/environment';

export interface TokenGenerationRequest {
  prompt: string;
  seed?: number;
  aspect_ratio?: string;
  size?: 'small' | 'regular' | 'big';
  width?: number;
  height?: number;
  guidance_scale?: number;
}

export interface TokenGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    prompt: string;
    seed?: number;
    aspect_ratio?: string;
    size?: string;
    width?: number;
    height?: number;
    guidance_scale?: number;
    generatedAt: Date;
  };
}

export interface TokenPreview {
  id: string;
  imageUrl: string;
  prompt: string;
  generatedAt: Date;
  status: 'generating' | 'completed' | 'failed';
}

class AITokenService {
  private openaiApiKey: string;
  private basePrompt: string;

  constructor() {
    // Initialize OpenAI API key from environment config
    const aiConfig = getAIConfig();
    this.openaiApiKey = aiConfig.openaiApiKey;
    this.basePrompt = "Warp the token with a horizontal oval curve: center thickest and enlarged, edges bending backwards like wrapping on a hat. Make the design colorful, vibrant, and bold with high contrast. Only show the warped token, transparent background, no hat, no shadows, no glow.";
  }

  /**
   * Generate a custom token using OpenAI gpt-image-1
   */
  async generateToken(request: TokenGenerationRequest): Promise<TokenGenerationResponse> {
    try {
      console.log('🎨 Generating AI token with gpt-image-1...');
      console.log('📝 User prompt:', request.prompt);

      // Prepend the base prompt to the user's prompt
      const fullPrompt = `${this.basePrompt}\n\n${request.prompt}`;
      console.log('📝 Full prompt sent to gpt-image-1:', fullPrompt);

      // Use the full prompt for image generation
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: fullPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'auto',
          background: 'transparent',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      console.log('🔍 gpt-image-1 response structure:', JSON.stringify(data, null, 2));
      
      let imageData: string | undefined;
      
      if (data.data && data.data.length > 0) {
        // Try different possible formats
        const firstItem = data.data[0];
        
        if (firstItem.b64_json) {
          // Base64 format
          imageData = `data:image/png;base64,${firstItem.b64_json}`;
          console.log('📸 Using base64 format');
        } else if (firstItem.url) {
          // URL format
          imageData = firstItem.url;
          console.log('📸 Using URL format');
        } else if (typeof firstItem === 'string') {
          // Direct base64 string
          imageData = `data:image/png;base64,${firstItem}`;
          console.log('📸 Using direct base64 format');
        }
        
        if (imageData) {
          console.log('✅ Token generated successfully with gpt-image-1!');

          return {
            success: true,
            imageUrl: imageData,
            metadata: {
              prompt: fullPrompt,
              originalPrompt: request.prompt,
              width: 1024,
              height: 1024,
              generatedAt: new Date(),
            },
          };
        } else {
          throw new Error('No image data found in response');
        }
      } else {
        throw new Error('No image data returned from OpenAI API');
      }
    } catch (error) {
      console.error('❌ Error generating token:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }


  /**
   * Generate a token with optimized settings for hat designs
   */
  async generateHatToken(prompt: string): Promise<TokenGenerationResponse> {
    return this.generateToken({
      prompt: prompt,
      width: 1024,
      height: 1024,
    });
  }

  /**
   * Generate a token with optimized settings for digital display
   */
  async generateDigitalToken(prompt: string): Promise<TokenGenerationResponse> {
    return this.generateToken({
      prompt: prompt,
      width: 1024,
      height: 1024,
    });
  }

  /**
   * Generate a token with custom dimensions
   */
  async generateCustomToken(
    prompt: string, 
    width: number = 1024, 
    height: number = 1024
  ): Promise<TokenGenerationResponse> {
    return this.generateToken({
      prompt,
      width: 1024,
      height: 1024,
    });
  }

  /**
   * Validate prompt for appropriate content
   */
  validatePrompt(prompt: string): { isValid: boolean; error?: string } {
    if (!prompt.trim()) {
      return { isValid: false, error: 'Prompt cannot be empty' };
    }

    if (prompt.length < 10) {
      return { isValid: false, error: 'Prompt must be at least 10 characters long' };
    }

    if (prompt.length > 500) {
      return { isValid: false, error: 'Prompt must be less than 500 characters' };
    }

    // Check for inappropriate content (basic filtering)
    const inappropriateWords = ['nude', 'naked', 'explicit', 'adult', 'nsfw'];
    const lowerPrompt = prompt.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerPrompt.includes(word)) {
        return { isValid: false, error: 'Prompt contains inappropriate content' };
      }
    }

    return { isValid: true };
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      name: 'OpenAI DALL-E',
      description: 'OpenAI\'s advanced image generation model',
      capabilities: [
        'High-quality image generation',
        'Strong instruction following',
        'Creative and artistic output',
        'Safe content generation',
      ],
      supportedSizes: ['1024x1024'],
      maxPromptLength: 1000,
    };
  }
}

export default new AITokenService();
