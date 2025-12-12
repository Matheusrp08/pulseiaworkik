import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class BullMQService implements OnModuleInit, OnModuleDestroy {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private connection: IORedis.Redis;
  private readonly logger = new Logger(BullMQService.name);

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.error('REDIS_URL environment variable is not set');
      throw new Error('REDIS_URL environment variable is required');
    }
    this.connection = new IORedis(redisUrl);
  }

  async onModuleInit() {
    this.logger.log('BullMQService initializing');
    // Initialize queues for codegen, bugfix, deploy jobs, preview, etc.
    this.createQueue('codegen');
    this.createQueue('bugfix');
    this.createQueue('deploy');
    this.createQueue('preview');

    // Workers can be initialized here or in dedicated services
    this.createWorker('codegen', async (job: Job) => {
      this.logger.log(`Processing codegen job ${job.id}`);
      // Job processing logic should be implemented in respective services
      // Placeholder: mark job complete
      return {};
    }, 5);

    this.createWorker('bugfix', async (job: Job) => {
      this.logger.log(`Processing bugfix job ${job.id}`);
      return {};
    }, 5);

    this.createWorker('deploy', async (job: Job) => {
      this.logger.log(`Processing deploy job ${job.id}`);
      return {};
    }, 2);

    this.createWorker('preview', async (job: Job) => {
      this.logger.log(`Processing preview job ${job.id}`);
      return {};
    }, 3);
  }

  async onModuleDestroy() {
    this.logger.log('Closing BullMQService connections');
    for (const worker of this.workers.values()) {
      await worker.close();
    }
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    await this.connection.quit();
  }

  createQueue(name: string): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
    }
    const queue = new Queue(name, { connection: this.connection });
    this.queues.set(name, queue);
    return queue;
  }

  createWorker(name: string, processor: (job: Job) => Promise<any>, concurrency = 1): Worker {
    if (this.workers.has(name)) {
      return this.workers.get(name)!;
    }
    const worker = new Worker(name, processor, { connection: this.connection, concurrency });
    worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job.id} in queue ${name} failed: ${err.message}`, err.stack);
    });
    this.workers.set(name, worker);
    return worker;
  }

  async addJob(queueName: string, jobName: string, data: any, opts?: object): Promise<Job> {
    const queue = this.createQueue(queueName);
    try {
      return await queue.add(jobName, data, opts);
    } catch (error) {
      this.logger.error(`Failed to add job ${jobName} to queue ${queueName}`, error);
      throw error;
    }
  }

  getQueue(queueName: string): Queue | undefined {
    return this.queues.get(queueName);
  }
}
