import {
    Injectable,
    Logger,
    Inject,
    OnModuleInit
} from '@nestjs/common';
import Redis from 'ioredis';
import {
    BUILD_PWA_CHANNEL,
    CREATE_APP_EVENT
} from "../../../pwa-shared/src/types/bullmq/queues";
import { GeneratorRepository } from "../core/generator.repository";

// 🔥 1. Імпортуємо ОБИДВА клієнти Redis
import {
    REDIS_SUBSCRIBER,
    REDIS_PUBLISHER // Потрібен для команд (SET, HSET, DEL)
} from "../../../pwa-shared/src/modules/redis/pub-sub.providers";

// Припускаємо, що у вас є цей тип, що описує повідомлення
interface CreateAppPayload {
    appId: string;
    Domain: string; // Або 'domain'
    // ...інші поля
}

@Injectable()
export class GeneratorSubscriber implements OnModuleInit{
    private readonly logger = new Logger(GeneratorSubscriber.name);
    private readonly channel = `${BUILD_PWA_CHANNEL}:${CREATE_APP_EVENT}`;

    private readonly PENDING_BUILDS_KEY = 'pending:builds';
    private readonly LOCK_KEY_PREFIX = 'lock:build:';
    private readonly LOCK_TTL = 60;

    constructor(
        private readonly repo: GeneratorRepository,
        @Inject(REDIS_SUBSCRIBER) private readonly subscriberClient: Redis,
        @Inject(REDIS_PUBLISHER) private readonly commandClient: Redis,
    ) {}
    async onModuleInit() {
        this.logger.log('Initializing GeneratorSubscriber...');
        await this.republishPendingJobs();
        await this.subscriberClient.subscribe(this.channel);
        this.subscriberClient.on('message', (channel, message) => {
            if (channel === this.channel) {
                this.handleMessage(message);
            }
        });

        this.logger.log(`Subscribed to channel: ${this.channel}`);
    }


    private async republishPendingJobs() {
        this.logger.log(`Checking for pending jobs in ${this.PENDING_BUILDS_KEY}...`);

        const pendingJobsMap = await this.commandClient.hgetall(this.PENDING_BUILDS_KEY);
        const jobMessages = Object.values(pendingJobsMap);

        if (jobMessages.length === 0) {
            this.logger.log('No pending jobs found. Proceeding normally.');
            return;
        }

        this.logger.warn(`Found ${jobMessages.length} pending jobs. Republishing...`);

        const pipeline = this.commandClient.pipeline();
        for (const message of jobMessages) {
            pipeline.publish(this.channel, message);
        }
        await pipeline.exec();

        this.logger.warn('All pending jobs have been republished.');
    }

    private async handleMessage(message: string) {
        let payload: CreateAppPayload;
        try {
            payload = JSON.parse(message);
        } catch (error) {
            this.logger.error(`Failed to parse JSON message: ${message}`, error);
            return;
        }
        const lockKey = `${this.LOCK_KEY_PREFIX}:${payload.appId}:${payload.Domain}`;
        let lockAcquired = false;

        try {
            const result = await this.commandClient.set(lockKey, 'locked', 'EX', this.LOCK_TTL, 'NX');
            if (result !== 'OK') {
                this.logger.log(`Job ${payload.appId} is already locked by another worker. Skipping.`);
                return;
            }

            lockAcquired = true;
            this.logger.log(`Lock acquired for job ${payload.appId}.`);
            await this.commandClient.hset(this.PENDING_BUILDS_KEY, payload.appId, message);
            await this.commandClient.hdel(this.PENDING_BUILDS_KEY, payload.appId);
            this.logger.log(`Job ${payload.appId} processed successfully.`);

        } catch (error) {
            this.logger.error(`Failed to process message for App ID ${payload.appId}: ${error}`);
        } finally {
            if (lockAcquired) {
                await this.commandClient.del(lockKey);
                this.logger.log(`Lock released for job ${payload.appId}.`);
            }
        }
    }
}