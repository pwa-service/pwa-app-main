import { Injectable, Logger, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { CreateAppPayload } from "../../../pwa-shared/src";
import {REDIS_PUBLISHER} from "../../../pwa-shared/src/modules/redis/pub-sub.providers";
import {BUILD_PWA_CHANNEL, CREATE_APP_EVENT} from "../../../pwa-shared/src/types/bullmq/queues";

@Injectable()
export class GeneratorPublisher {
    private readonly logger = new Logger(GeneratorPublisher.name);
    private readonly channel = `${BUILD_PWA_CHANNEL}:${CREATE_APP_EVENT}`;
    constructor(
        @Inject(REDIS_PUBLISHER) private readonly publisherClient: Redis,
    ) {}

    async createApp(data: CreateAppPayload) {
        const message = JSON.stringify(data);

        this.logger.log(`Publishing event to channel: ${this.channel} for App ID: ${data.appId}`);
        await this.publisherClient.publish(this.channel, message);
        this.logger.log(`Event published successfully.`);
    }
}