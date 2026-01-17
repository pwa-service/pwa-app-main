import { Module } from '@nestjs/common';
import { PixelTokenController } from './pixel-token.controller';
import { PixelTokenRepository } from './pixel-token.repository';
import {PixelTokenService} from "./pixel-token.core.service";
import {PrismaService} from "../../../pwa-prisma/src";
import {GrpcAuthModule} from "../../../pwa-shared/src/modules/auth/grpc-auth.module";
import {GrpcAuthInterceptor} from "../../../pwa-shared/src";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {join} from "path";


const AUTH_PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos', 'auth.proto')
@Module({
    imports: [
        GrpcAuthModule,
        ClientsModule.register([
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
        ]),
    ],
    controllers: [PixelTokenController],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: GrpcAuthInterceptor },
        PixelTokenService,
        PixelTokenRepository,
        PrismaService,
    ],
    exports: [PixelTokenService],
})
export class PixelTokenModule {}