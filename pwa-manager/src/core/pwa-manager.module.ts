import { Module } from '@nestjs/common';
import { PwaManagerController } from './pwa-manager.controller';
import { PwaManagerCoreService } from './pwa-manager.core.service';
import { GeneratorPubSubModule } from "../generator/generator.queue.module";
import { PrismaModule } from "../../../pwa-prisma/src";
import { PwaManagerRepository } from "./pwa-manager.repository";
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
    GrpcAuthInterceptor,
} from "../../../pwa-shared/src";
import { GrpcAuthModule } from "../../../pwa-shared/src/modules/auth/grpc-auth.module";
import { PixelTokenModule } from "../pixel-token-manager/pixel-token.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { existsSync } from "fs";


import { IsDomainExists } from "../common/pipes/is-domain-exists.pipe";


const PROTO_DIR = existsSync(join(process.cwd(), 'protos'))
    ? join(process.cwd(), 'protos')
    : join(process.cwd(), '..', 'pwa-protos', 'protos');

const AUTH_PROTO_DIR = join(PROTO_DIR, 'auth.proto');
@Module({
    imports: [PrismaModule, GeneratorPubSubModule, GrpcAuthModule, PixelTokenModule, ClientsModule.register([
        {
            name: 'AUTH_PACKAGE',
            transport: Transport.GRPC,
            options: {
                package: 'auth.v1',
                protoPath: AUTH_PROTO_DIR,
                url: process.env.AUTH_SERVICE_GRPC_URL || 'localhost:50051',
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
    ]),],
    controllers: [PwaManagerController],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: GrpcAuthInterceptor },
        PwaManagerCoreService,
        PwaManagerRepository,
        IsDomainExists,
    ],
})
export class PwaManagerModule { }