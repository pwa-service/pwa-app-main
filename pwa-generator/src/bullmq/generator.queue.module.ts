import { Module } from '@nestjs/common';
import { PWA_EVENTS_PREFIX } from "../../../pwa-shared/src/types/bullmq/queues";
import {GeneratorPublisher} from "./generator.publisher";
import { GeneratorRepository } from "../core/generator.repository";
import {RedisPubSubModule} from "../../../pwa-shared/src/modules/redis/pub-sub.module";
import {GeneratorSubscriber} from "./generator.subscriber";

@Module({
    imports: [
        RedisPubSubModule.register({
            host: process.env.REDIS_HOST || 'localhost',
            port: +(process.env.REDIS_PORT || 6379),
            password: process.env.REDIS_PASSWORD || undefined,
            prefix: PWA_EVENTS_PREFIX,
        }),
    ],
    providers: [GeneratorSubscriber, GeneratorPublisher, GeneratorRepository],
    exports: [GeneratorSubscriber, GeneratorPublisher],
})
export class GeneratorPubSubModule {}