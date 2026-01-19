import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {GrpcErrorInterceptor} from "./global/interceptors/grpc-error.interceptor";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            trustProxy: true,
        }),
        { cors: false }
    );

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
    app.useGlobalInterceptors(new GrpcErrorInterceptor())
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With',
            'sec-ch-ua',
            'sec-ch-ua-mobile',
            'sec-ch-ua-platform'
        ],
    });
    app.enableShutdownHooks();
    await app.listen(3000, '0.0.0.0');
    console.log('🚀 Gateway on http://localhost:3000');
}

bootstrap()