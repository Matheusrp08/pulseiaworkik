import { Injectable, Logger } from '@nestjs/common';

export interface TogetherRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

@Injectable()
export class TogetherClient {
  private readonly logger = new Logger(TogetherClient.name);

  async generate(request: TogetherRequest): Promise<string> {
    // Placeholder implementation: In real setup, call Together AI API here
    this.logger.debug('TogetherClient.generate called with prompt length ' + request.prompt.length);
    return Promise.resolve('Together AI generated response placeholder');
  }
}
