import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { BUILD_QUEUE_NAME } from "../../../pwa-shared/src/types/bullmq/queues";
import { BUILD_QUEUE_CREATE_APP_JOB } from "../../../pwa-shared/src/types/bullmq/queues";
import {CreateAppPayload} from "../../../pwa-shared/src";


@Injectable()
export class GeneratorProducer {
    private readonly logger = new Logger(GeneratorProducer.name);

    constructor(@InjectQueue(BUILD_QUEUE_NAME) private readonly buildQueue: Queue) {}

    async createApp(data: CreateAppPayload) {
        this.logger.log(`Adding build job for App ID: ${data.appId} to the queue.`);
        await this.buildQueue.add(BUILD_QUEUE_CREATE_APP_JOB, data, {
            jobId: `${data.appId}`,
        });
    }
}