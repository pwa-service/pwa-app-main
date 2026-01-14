import { Module } from '@nestjs/common';
import { PixelTokenController } from './pixel-token.controller';
import { PixelTokenRepository } from './pixel-token.repository';
import {PixelTokenService} from "./pwa-manager.core.service";
import {PrismaService} from "../../../pwa-prisma/src";
import {GrpcAuthModule} from "../../../pwa-shared/src/modules/auth/grpc-auth.module";
import {AuthRepository} from "../../../pwa-prisma/src/global/repository/auth.repository";
import {GrpcAuthInterceptor, USER_LOOKUP_PORT} from "../../../pwa-shared/src";
import {APP_INTERCEPTOR} from "@nestjs/core";

@Module({
    imports: [GrpcAuthModule],
    controllers: [PixelTokenController],
    providers: [
        AuthRepository,
        { provide: USER_LOOKUP_PORT, useExisting: AuthRepository },
        { provide: APP_INTERCEPTOR, useClass: GrpcAuthInterceptor },
        PixelTokenService,
        PixelTokenRepository,
        PrismaService,
    ],
    exports: [PixelTokenService],
})
export class PixelTokenModule {}