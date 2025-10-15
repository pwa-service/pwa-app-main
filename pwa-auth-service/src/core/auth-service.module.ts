import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '../../../pwa-prisma/src';
import { GrpcAuthModule } from '../../../pwa-shared/src/modules/auth/grpc-auth.module';
import { GrpcAuthInterceptor, USER_LOOKUP_PORT } from '../../../pwa-shared/src/modules/auth/interceptors/grpc-auth.interceptor';
import { AuthGrpcController } from './auth.grpc.controller';
import { JwksController } from './jwks.controller';
import { AuthCoreService } from './auth.core.service';
import { AuthRepository } from './auth.repository';
import { RefreshStore } from '../../../pwa-shared/src/modules/auth/common/refresh.store';

@Module({
    imports: [PrismaModule, GrpcAuthModule],
    controllers: [AuthGrpcController, JwksController],
    providers: [
        AuthCoreService,
        AuthRepository,
        RefreshStore,
        { provide: USER_LOOKUP_PORT, useClass: AuthRepository },
        { provide: APP_INTERCEPTOR, useClass: GrpcAuthInterceptor },
    ],
})
export class AuthServiceModule {}