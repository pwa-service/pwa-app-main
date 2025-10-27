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
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getMailConfig} from "../mail/mail.config";
import {MailerModule} from "@nestjs-modules/mailer";

@Module({
    imports: [
        ConfigModule.forRoot(),
        PrismaModule,
        GrpcAuthModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMailConfig,
        }),
    ],
    controllers: [AuthGrpcController, JwksController],
    providers: [
        AuthCoreService,
        AuthRepository,
        RefreshStore,
        { provide: USER_LOOKUP_PORT, useExisting: AuthRepository },
        { provide: APP_INTERCEPTOR, useClass: GrpcAuthInterceptor },
    ],
})
export class AuthServiceModule {}