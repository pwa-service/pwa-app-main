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


const AUTH_PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos', 'auth.proto')
import { IsDomainExistsConstraint } from "../../../pwa-shared/src/common/validators/is-domain-exists.validator";

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
                    includeDirs: [AUTH_PROTO_DIR],
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
        IsDomainExistsConstraint
    ],
})
export class PwaManagerModule { }