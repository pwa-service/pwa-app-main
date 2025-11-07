import { Logger } from '@nestjs/common';
import {
    Processor,
    WorkerHost,
} from '@nestjs/bullmq';
import {Job} from "bullmq";
import {CREATE_APP_QUEUE} from "../../../pwa-shared/src/types/bullmq/queues";
import {CreateAppPayload} from "../../../pwa-shared/src";
import {GeneratorRepository} from "../core/generator.repository";


@Processor(CREATE_APP_QUEUE)
export class LoggerProcessor extends WorkerHost {
    private readonly logger = new Logger(LoggerProcessor.name);

    constructor(
        private readonly repo: GeneratorRepository,
    ) {
        super();
    }

    async process(job: Job<CreateAppPayload>): Promise<void> {
        // await this.repo.setActive(job.data.appId!)
        this.logger.log(`Processed created app job for App ID: ${job.data.appId}.`);
    }
}
