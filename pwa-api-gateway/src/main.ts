import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import multipart from '@fastify/multipart';
import { GrpcErrorInterceptor } from "./common/interceptors/grpc-error.interceptor";
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            trustProxy: true,
        }),
        { cors: false }
    );

    await app.register(multipart, {
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB
        }
    });
    app.useStaticAssets({
        root: join(process.cwd(), 'uploads'),
        prefix: '/uploads/',
    });

    app.setGlobalPrefix('api');
    const config = new DocumentBuilder()
        .setTitle('PWA Gateway API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );
    app.useGlobalInterceptors(new GrpcErrorInterceptor());
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.enableShutdownHooks();

    await app.listen(3000, '0.0.0.0');
    console.log('🚀 Gateway on http://localhost:3000');
}

bootstrap();