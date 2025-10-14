import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../pwa-prisma/src';
import { AuthGrpcController } from './auth.grpc.controller';
import { AuthCoreService } from './auth.core.service';
import { AuthRepository } from './auth.repository';
import { JwksController } from './jwks.controller';
import { GrpcAuthModule } from '../../../pwa-shared/src/modules/auth/grpc-auth.module';
import { USER_LOOKUP_PORT } from '../../../pwa-shared/src/modules/auth/interceptors/grpc-auth.interceptor';
import {RefreshStore} from "../../../pwa-shared/src/modules/auth/common/refresh.store";
import {JwtVerifierService} from "../../../pwa-shared/src/modules/auth/jwt-verifier.service";

@Module({
    imports: [
        PrismaModule,
        GrpcAuthModule
    ],
    controllers: [AuthGrpcController, JwksController],
    providers: [
        AuthCoreService,
        AuthRepository,
        RefreshStore,
        JwtVerifierService,
        {
            provide: USER_LOOKUP_PORT,
            useValue: USER_LOOKUP_PORT
        }
    ],
})
export class AuthServiceModule {}