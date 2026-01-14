import { Module } from '@nestjs/common';
import { PwaManagerController } from './pwa-manager.controller';
import { PwaManagerCoreService } from './pwa-manager.core.service';
import {GeneratorPubSubModule} from "../bullmq/generator.queue.module";
import {PrismaModule} from "../../../pwa-prisma/src";
import {PwaManagerRepository} from "./pwa-manager.repository";
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
    GrpcAuthInterceptor,
    USER_LOOKUP_PORT,
} from "../../../pwa-shared/src";
import {AuthRepository} from "../../../pwa-prisma/src/global/repository/auth.repository";
import {GrpcAuthModule} from "../../../pwa-shared/src/modules/auth/grpc-auth.module";
import {PixelTokenModule} from "../pixel-token-manager/pixel-token.module";

@Module({
    imports: [PrismaModule, GeneratorPubSubModule, GrpcAuthModule, PixelTokenModule],
    controllers: [PwaManagerController],
    providers: [
        AuthRepository,
        { provide: USER_LOOKUP_PORT, useExisting: AuthRepository },
        { provide: APP_INTERCEPTOR, useClass: GrpcAuthInterceptor },
        PwaManagerCoreService,
        PwaManagerRepository
    ],
})
export class PwaManagerModule {}