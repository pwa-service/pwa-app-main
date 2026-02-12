import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import {DomainManagerModule} from "./core/domain-manager.module";
import {StripUserPipe} from "../../pwa-shared/src/common/pipes/strip-user.pipe";


const PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos');
async function bootstrap() {
    const logger = new Logger('DomainService');

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        DomainManagerModule,
        {
            transport: Transport.GRPC,
            options: {
                package: 'domain_manager.v1',
                protoPath: join(PROTO_DIR, 'domain_manager.proto'),
                url: process.env.DOMAIN_MANAGER_GRPC_URL || 'localhost:50057',
                loader: {
                    includeDirs: [join(PROTO_DIR, 'domain_manager.proto')],
                    keepCase: false,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true,
                },
            },
        }
    );

    app.useGlobalPipes(new StripUserPipe());
    app.enableShutdownHooks();
    await app.listen();
    logger.log('Domain Microservice is listening on gRPC port 50051...');
}

bootstrap();