import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import fastifyCors from 'fastify-cors';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import fastify from 'fastify';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, new fastify.FastifyAdapter());

  // Enable CORS
  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Pulse IA API')
    .setDescription('API documentation for Pulse IA platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Application listening on port ${port}`);
}
bootstrap().catch((err) => {
  // Log unhandled bootstrap errors
  console.error('Bootstrap error:', err);
  process.exit(1);
});
