import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {BUILD_QUEUE_NAME, CREATE_APP_QUEUE, PWA_EVENTS_PREFIX} from "../../../pwa-shared/src/types/bullmq/queues";
import {GeneratorProducer} from "./generator.producer";
import {LoggerProcessor} from "./generator.processor";
import {GeneratorRepository} from "../core/generator.repository";

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
            name: BUILD_QUEUE_NAME,
            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: 100,
            },
        }),
        BullModule.registerQueue({
            name: CREATE_APP_QUEUE,
            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: 100,
            },
        }),
    ],
    providers: [GeneratorProducer, LoggerProcessor, GeneratorRepository],
    exports: [GeneratorProducer, LoggerProcessor],
})
export class GeneratorQueueModule {}
