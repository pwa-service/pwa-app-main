import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../pwa-prisma/src';
import { EventHandlerGrpcController } from './event-handler.grpc.controller';
import { EventHandlerCoreService } from './event-handler.core.service';
import { EventHandlerRepository } from './event-handler.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcClientMetaInterceptor } from '../common/interceptors/grpc-client-meta.interceptor';
import {EventLogQueueModule} from "../queues/event-log.queue.module";
import {MonitoringModule} from "../../../pwa-shared/src/modules/monitoring/monitoring.module";
import {makeCounterProvider, makeHistogramProvider} from "@willsoto/nestjs-prometheus";

@Module({
    imports: [PrismaModule, EventLogQueueModule, MonitoringModule],
    controllers: [EventHandlerGrpcController],
    providers: [
        EventHandlerCoreService,
        EventHandlerRepository,
        { provide: APP_INTERCEPTOR, useClass: GrpcClientMetaInterceptor },
        makeCounterProvider({
            name: 'fb_capi_events_total',
            help: 'Total number of Facebook CAPI events processed',
            labelNames: ['event', 'status'],
        }),

        makeHistogramProvider({
            name: 'fb_capi_duration_seconds',
            help: 'Duration of Facebook CAPI HTTP requests',
            labelNames: ['event', 'http_status'],
            buckets: [0.1, 0.5, 1, 2, 5, 10],
        }),
    ],
})
export class EventHandlerModule {}