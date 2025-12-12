import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { BullMQModule } from './bullmq/bullmq.module';
import { AIIntegrationModule } from './ai/ai-integration.module';
import { ChatModule } from './chat/chat.module';
import { CodegenModule } from './codegen/codegen.module';
import { TimelineModule } from './timeline/timeline.module';
import { BugfixModule } from './bugfix/bugfix.module';
import { PreviewModule } from './preview/preview.module';
import { DeployModule } from './deploy/deploy.module';
import { PluginModule } from './plugin/plugin.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    BullMQModule,
    AIIntegrationModule,
    ChatModule,
    CodegenModule,
    TimelineModule,
    BugfixModule,
    PreviewModule,
    DeployModule,
    PluginModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
