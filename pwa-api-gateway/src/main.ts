import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
  );

  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });
  app.enableShutdownHooks();
  await app.listen(3000, '0.0.0.0');
  console.log('🚀 Gateway on http://localhost:3000');
}

bootstrap();
