import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../pwa-prisma/src';
import { EventHandlerGrpcController } from './event-handler.grpc.controller';
import { EventHandlerCoreService } from './event-handler.core.service';
import { EventHandlerRepository } from './event-handler.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcClientMetaInterceptor } from '../common/interceptors/grpc-client-meta.interceptor';

@Module({
    imports: [PrismaModule],
    controllers: [EventHandlerGrpcController],
    providers: [
        EventHandlerCoreService,
        EventHandlerRepository,
        { provide: APP_INTERCEPTOR, useClass: GrpcClientMetaInterceptor },
    ],
})
export class EventHandlerModule {}