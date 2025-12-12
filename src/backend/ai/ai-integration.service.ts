import { Injectable, Logger } from '@nestjs/common';
import { OllamaClient } from './clients/ollama.client';
import { OpenAIClient } from './clients/openai.client';
import { GroqClient } from './clients/groq.client';
import { FireworksClient } from './clients/fireworks.client';
import { TogetherClient } from './clients/together.client';

export type AIProvider = 'ollama' | 'openai' | 'groq' | 'fireworks' | 'together';

export interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  provider?: AIProvider;
  [key: string]: any;
}

@Injectable()
export class AIIntegrationService {
  private readonly logger = new Logger(AIIntegrationService.name);

  constructor(
    private readonly ollamaClient: OllamaClient,
    private readonly openAIClient: OpenAIClient,
    private readonly groqClient: GroqClient,
    private readonly fireworksClient: FireworksClient,
    private readonly togetherClient: TogetherClient,
  ) {}

  async generateText(request: AIRequest): Promise<string> {
    try {
      const provider = request.provider ?? 'ollama';

      switch (provider) {
        case 'ollama':
          return await this.ollamaClient.generate(request);
        case 'openai':
          return await this.openAIClient.generate(request);
        case 'groq':
          return await this.groqClient.generate(request);
        case 'fireworks':
          return await this.fireworksClient.generate(request);
        case 'together':
          return await this.togetherClient.generate(request);
        default:
          this.logger.warn(`Unknown AI provider '${provider}', falling back to Ollama`);
          return await this.ollamaClient.generate(request);
      }
    } catch (error) {
      this.logger.error('AI generation error', error);
      // Fallback to Ollama if not already tried
      if (request.provider !== 'ollama') {
        this.logger.warn('Falling back to Ollama provider');
        try {
          return await this.ollamaClient.generate(request);
        } catch (fallbackError) {
          this.logger.error('Fallback Ollama generation failed', fallbackError);
          throw fallbackError;
        }
      }
      throw error;
    }
  }
}
