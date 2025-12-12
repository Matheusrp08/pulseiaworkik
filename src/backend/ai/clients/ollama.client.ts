import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';

export interface OllamaRequest {
  prompt: string;
  modelPath?: string;
  maxTokens?: number;
  temperature?: number;
}

@Injectable()
export class OllamaClient {
  private readonly logger = new Logger(OllamaClient.name);

  async generate(request: OllamaRequest): Promise<string> {
    const modelPath = request.modelPath || process.env.OLLAMA_MODEL_PATH;
    if (!modelPath) {
      this.logger.error('OLLAMA_MODEL_PATH environment variable not set');
      throw new Error('OLLAMA_MODEL_PATH environment variable not set');
    }

    return new Promise<string>((resolve, reject) => {
      try {
        const args = ['run', modelPath, '--prompt', request.prompt];
        if (request.maxTokens) {
          args.push('--max-tokens', `${request.maxTokens}`);
        }
        if (request.temperature !== undefined) {
          args.push('--temperature', `${request.temperature}`);
        }

        const cmd = spawn('ollama', args);
        let output = '';
        let errorOutput = '';

        cmd.stdout.on('data', (data) => {
          output += data.toString();
        });

        cmd.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        cmd.on('close', (code) => {
          if (code === 0) {
            resolve(output.trim());
          } else {
            this.logger.error(`Ollama process exited with code ${code}: ${errorOutput}`);
            reject(new Error(`Ollama process exited with code ${code}: ${errorOutput}`));
          }
        });
      } catch (err) {
        this.logger.error('Error running Ollama client', err);
        reject(err);
      }
    });
  }
}
