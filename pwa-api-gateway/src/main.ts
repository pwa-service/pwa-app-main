import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {GrpcErrorInterceptor} from "./global/interceptors/grpc-error.interceptor";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
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
        origin: '*',
    });
    app.enableShutdownHooks();
    await app.listen(3000, '0.0.0.0');
    console.log('🚀 Gateway on http://localhost:3000');
}

bootstrap()