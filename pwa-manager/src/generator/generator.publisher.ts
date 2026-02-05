import {
    Injectable,
    Logger,
    Inject,
    OnModuleInit
} from '@nestjs/common';
import Redis from 'ioredis';
import { CreateAppPayload } from "../../../pwa-shared/src";
import { REDIS_PUBLISHER } from "../../../pwa-shared/src/modules/redis/pub-sub.providers";
import { BUILD_PWA_CHANNEL, CREATE_APP_EVENT } from "../../../pwa-shared/src/types/bullmq/queues";

@Injectable()
export class GeneratorPublisher implements OnModuleInit {
    private readonly logger = new Logger(GeneratorPublisher.name);
    private readonly NEW_JOB_CHANNEL = `${BUILD_PWA_CHANNEL}:${CREATE_APP_EVENT}`;
    private readonly PENDING_BUILDS_KEY = 'pending:builds';
    private readonly LOCK_KEY_PREFIX = 'lock:build:';
    private readonly LOCK_TTL = 360;

    constructor(
        @Inject(REDIS_PUBLISHER) private readonly commandClient: Redis,
    ) {}

    async onModuleInit() {
        this.logger.log('[Publisher] Initializing...');
        await this.republishPendingJobs();
    }

    async createApp(data: CreateAppPayload) {
        const lockKey = `${this.LOCK_KEY_PREFIX}:${data.appId}:${data.domain}`;
        const message = JSON.stringify(data);

        try {
            const result = await this.commandClient.set(lockKey, 'locked', 'EX', this.LOCK_TTL, 'NX');

            if (result !== 'OK') {
                this.logger.warn(`Job ${data.appId} is already locked (likely pending). Skipping publish.`);
                return;
            }

            await this.commandClient.hset(this.PENDING_BUILDS_KEY, data.appId!, message);
            await this.commandClient.publish(this.NEW_JOB_CHANNEL, message);
            this.logger.log(`Event published and locked successfully for ${data.appId}.`);
        } catch (error) {
            this.logger.error(`Failed to publish job ${data.appId}`, error);
        }
    }

    private async republishPendingJobs() {
        this.logger.log(`[Publisher] Checking for pending jobs in ${this.PENDING_BUILDS_KEY}...`);
        const pendingJobsMap = await this.commandClient.hgetall(this.PENDING_BUILDS_KEY);
        const jobMessages = Object.values(pendingJobsMap);

        if (jobMessages.length === 0) {
            this.logger.log('[Publisher] No pending jobs found.');
            return;
        }

        this.logger.warn(`[Publisher] Found ${jobMessages.length} pending jobs. Republishing...`);

        const pipeline = this.commandClient.pipeline();
        for (const message of jobMessages) {
            pipeline.publish(this.NEW_JOB_CHANNEL, message);
        }
        await pipeline.exec();

        this.logger.warn('[Publisher] All pending jobs have been republished.');
    }
}