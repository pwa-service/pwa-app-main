import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {CreateEventLogPayload} from "../../../pwa-shared/src";
import {PWA_EVENTS_QUEUE} from "../../../pwa-shared/src/types/auth/bullmq/queues";

@Injectable()
export class EventLogProducer {
    private readonly log = new Logger(EventLogProducer.name);

    constructor(@InjectQueue(PWA_EVENTS_QUEUE) private readonly q: Queue<CreateEventLogPayload>) {}

    async createLog(data: CreateEventLogPayload) {
        this.log.debug({ tag: 'event-log:enqueue', data });
        await this.q.add('event-log', data);
    }
}
