import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { PwaManagerModule } from "./core/pwa-manager.module";

async function bootstrap() {
    const PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos');

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        PwaManagerModule,
        {
            transport: Transport.GRPC,
            options: {
                package: ['pwa_apps_manager.v1', 'pixel_token.v1'],
                protoPath: [
                    join(PROTO_DIR, 'pwa-manager', 'pwa_apps_manager.proto'),
                    join(PROTO_DIR, 'pwa-manager', 'pixel_token_manager.proto'),
                ],
                url: process.env.PWA_MANAGER_GRPC_URL || '0.0.0.0:50055',
                loader: {
                    includeDirs: [PROTO_DIR],
                    keepCase: false,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true,
                },
            },
        },
    );
    await app.listen();
}
bootstrap();