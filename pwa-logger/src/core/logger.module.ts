import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {LoggerProcessor} from './logger.processor';
import {LoggerRepository} from "./logger.repository";
import { PrismaModule } from '../../../pwa-prisma/src';
import {PWA_EVENTS_PREFIX, PWA_EVENTS_QUEUE} from "../../../pwa-shared/src/types/bullmq/queues";

@Global()
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
        PrismaModule
    ],
    providers: [LoggerProcessor, LoggerRepository],
    exports: [BullModule],
})
export class LoggerModule {}
