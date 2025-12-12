import { Injectable, Logger } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

export interface OpenAIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

@Injectable()
export class OpenAIClient {
  private readonly logger = new Logger(OpenAIClient.name);
  private readonly openai: OpenAIApi;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY environment variable is not set');
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
  }

  async generate(request: OpenAIRequest): Promise<string> {
    try {
      const response = await this.openai.createCompletion({
        model: request.model || 'text-davinci-003',
        prompt: request.prompt,
        max_tokens: request.maxTokens ?? 512,
        temperature: request.temperature ?? 0.7,
      });
      if (response.data.choices.length === 0) {
        throw new Error('OpenAI API returned no choices');
      }
      return response.data.choices[0].text?.trim() ?? '';
    } catch (error) {
      this.logger.error('OpenAI generation error', error);
      throw error;
    }
  }
}
