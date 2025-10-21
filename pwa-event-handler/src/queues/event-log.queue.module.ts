import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {EventLogProducer } from './event-log.producer';
import {PWA_EVENTS_QUEUE, PWA_EVENTS_PREFIX} from "../../../pwa-shared/src/types/bullmq/queues";

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST || 'localhost',
                port: +(process.env.REDIS_PORT || 6379),
                password: process.env.REDIS_PASSWORD || undefined,
            },
            prefix: PWA_EVENTS_PREFIX,
        }),
        BullModule.registerQueue({
            name: PWA_EVENTS_QUEUE,
            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: 100,
            },
        }),
    ],
    providers: [EventLogProducer],
    exports: [EventLogProducer],
})
export class EventLogQueueModule {}
