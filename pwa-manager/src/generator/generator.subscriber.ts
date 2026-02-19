import {
    Injectable,
    Logger,
    Inject,
    OnModuleInit
} from '@nestjs/common';
import Redis from 'ioredis';
import {
    BUILD_FINISHED_EVENT, BUILD_PWA_CHANNEL, DELETE_FINISHED_EVENT
} from "../../../pwa-shared/src/types/bullmq/queues";
import { PwaManagerRepository } from "../core/pwa-manager.repository";
import {
    REDIS_SUBSCRIBER,
    REDIS_PUBLISHER
} from "../../../pwa-shared/src/modules/redis/pub-sub.providers";
import { CreateAppPayload, BuildFinishedPayload, DeleteAppPayload } from "../../../pwa-shared/src";

@Injectable()
export class GeneratorSubscriber implements OnModuleInit {
    private readonly logger = new Logger(GeneratorSubscriber.name);
    private readonly buildChannel = `${BUILD_PWA_CHANNEL}:${BUILD_FINISHED_EVENT}`;
    private readonly deleteChannel = `${BUILD_PWA_CHANNEL}:${DELETE_FINISHED_EVENT}`;
    private readonly PENDING_BUILDS_KEY = 'pending:builds';
    private readonly LOCK_KEY_PREFIX = 'lock:build:';

    constructor(
        private readonly repo: PwaManagerRepository,
        @Inject(REDIS_SUBSCRIBER) private readonly subscriberClient: Redis,
        @Inject(REDIS_PUBLISHER) private readonly commandClient: Redis,
    ) { }

    async onModuleInit() {
        await this.subscriberClient.subscribe(this.buildChannel, this.deleteChannel);
        this.subscriberClient.on('message', (channel, message) => {
            if (channel === this.buildChannel) {
                this.handleBuildCleanup(message);
            } else if (channel === this.deleteChannel) {
                this.handleDeleteFinished(message);
            }
        });
        this.logger.log(`Subscribed to channels: ${this.buildChannel}, ${this.deleteChannel}`);
    }

    private async handleBuildCleanup(message: string) {
        let statusPayload: BuildFinishedPayload;
        try {
            statusPayload = JSON.parse(message);
        } catch (error) {
            this.logger.error(`Failed to parse FINISHED message: ${message}`, error);
            return;
        }

        const { appId, status, error } = statusPayload;
        this.logger.log(`Received build status for ${appId}: ${status}`);

        try {
            const originalJobJSON = await this.commandClient.hget(this.PENDING_BUILDS_KEY, appId);

            if (!originalJobJSON) {
                this.logger.warn(`Job ${appId} not found in pending cache. Already cleaned up?`);
                return;
            }

            const originalJob: CreateAppPayload = JSON.parse(originalJobJSON);
            const lockKey = `${this.LOCK_KEY_PREFIX}:${originalJob.appId}:${originalJob.domain}`;
            await this.commandClient.hdel(this.PENDING_BUILDS_KEY, appId);
            await this.commandClient.del(lockKey);

            this.logger.log(`Cleanup complete for ${appId}. Status: ${status}`);
            if (status === 'ERROR') {
                this.logger.error(`Build failed for ${appId}: ${error}`);
            }

        } catch (error) {
            this.logger.error(`Failed to cleanup job ${appId}: ${error}`);
        }
    }

    private async handleDeleteFinished(message: string) {
        let payload: DeleteAppPayload & { status: string; error?: string };
        try {
            payload = JSON.parse(message);
        } catch (error) {
            this.logger.error(`Failed to parse DELETE_FINISHED message: ${message}`, error);
            return;
        }

        const { appId, domainId, status, error } = payload;
        this.logger.log(`Received delete status for ${appId}: ${status}`);

        if (status === 'ERROR') {
            this.logger.error(`Delete failed for ${appId}: ${error}`);
            return;
        }

        try {
            if (domainId) {
                await this.repo.setDomainActive(domainId);
                this.logger.log(`Domain ${domainId} set to active after app ${appId} deletion.`);
            }
        } catch (error) {
            this.logger.error(`Failed to set domain active for ${appId}: ${error}`);
        }
    }
}