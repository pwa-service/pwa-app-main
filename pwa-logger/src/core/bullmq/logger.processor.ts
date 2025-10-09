import { Logger } from '@nestjs/common';
import {
    Processor,
    WorkerHost,
} from '@nestjs/bullmq';
import { CreateEventLogPayload } from '../../../../pwa-shared/src';
import { LoggerRepository } from "../logger.repository";
import {Job} from "bullmq";
import {PWA_EVENTS_QUEUE} from "../../../../pwa-shared/src/types/auth/bullmq/queues";


@Processor(PWA_EVENTS_QUEUE)
export class LoggerProcessor extends WorkerHost {
    private readonly logger = new Logger(LoggerProcessor.name);

    constructor(
        private readonly repo: LoggerRepository,
    ) {
        super();
    }

    async process(job: Job<CreateEventLogPayload>): Promise<void> {
        console.log(123)
        await this.repo.createEventLog(job.data)
        console.log(321)
        this.logger.log(`[${PWA_EVENTS_QUEUE}] payload=${JSON.stringify(job.data)}`);
    }
}
