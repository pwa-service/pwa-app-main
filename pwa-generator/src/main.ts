import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import {AppModule} from "./app.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: 'generator.v1',
                protoPath: join(process.env.PROTO_DIR || process.cwd(), 'protos', 'generator.proto'),
                url: process.env.GENERATOR_GRPC_URL || '0.0.0.0:50055',
            },
        },
    );
    await app.listen();
}
bootstrap();