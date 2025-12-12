import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClient;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.error('REDIS_URL environment variable is not set');
      throw new Error('REDIS_URL environment variable is required');
    }
    this.client = new Redis(redisUrl);
  }

  async onModuleInit() {
    try {
      await this.client.ping();
      this.logger.log('Connected to Redis successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    } catch (error) {
      this.logger.error('Error closing Redis connection', error);
    }
  }

  getClient(): RedisClient {
    return this.client;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    try {
      if (ttlSeconds && ttlSeconds > 0) {
        return await this.client.set(key, value, 'EX', ttlSeconds);
      }
      return await this.client.set(key, value);
    } catch (error) {
      this.logger.error(`Redis set error for key ${key}`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Redis get error for key ${key}`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(`Redis del error for key ${key}`, error);
      throw error;
    }
  }

  async publish(channel: string, message: string): Promise<number> {
    try {
      return await this.client.publish(channel, message);
    } catch (error) {
      this.logger.error(`Redis publish error on channel ${channel}`, error);
      throw error;
    }
  }

  async subscribe(channel: string, listener: (message: string) => void): Promise<void> {
    try {
      const subscriber = this.client.duplicate();
      await subscriber.connect();
      await subscriber.subscribe(channel, (message) => {
        listener(message);
      });
    } catch (error) {
      this.logger.error(`Redis subscribe error on channel ${channel}`, error);
      throw error;
    }
  }
}
