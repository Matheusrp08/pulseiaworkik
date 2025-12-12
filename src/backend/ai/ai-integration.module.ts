import { Module } from '@nestjs/common';
import { AIIntegrationService } from './ai-integration.service';
import { OllamaClient } from './clients/ollama.client';
import { OpenAIClient } from './clients/openai.client';
import { GroqClient } from './clients/groq.client';
import { FireworksClient } from './clients/fireworks.client';
import { TogetherClient } from './clients/together.client';

@Module({
  providers: [
    AIIntegrationService,
    OllamaClient,
    OpenAIClient,
    GroqClient,
    FireworksClient,
    TogetherClient,
  ],
  exports: [AIIntegrationService],
})
export class AIIntegrationModule {}
