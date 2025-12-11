import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RefreshStore implements OnModuleInit, OnModuleDestroy {
    private redis!: RedisClientType;

    async onModuleInit() {
        this.redis = createClient({
            url: `redis://${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? 6379}`,
        });

        this.redis.on('error', (err) => console.error('Redis Client Error', err));
        await this.redis.connect();
    }

    async onModuleDestroy() {
        if (this.redis) {
            this.redis.destroy();
        }
    }

    async save(userId: string, token: string, exp: number) {
        const ttl = exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
            await this.redis.setEx(`refresh:${userId}`, ttl, token);
        }
    }

    async check(userId: string, token: string): Promise<boolean> {
        const stored = await this.redis.get(`refresh:${userId}`);
        return stored === token;
    }

    async revoke(userId: string) {
        await this.redis.del(`refresh:${userId}`);
    }

    async saveOneTime(tokenHash: string, userId: string, exp: number) {
        const ttl = exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
            await this.redis.setEx(`one-time:${tokenHash}`, ttl, userId);
        }
    }

    async checkAndGetOneTime(tokenHash: string): Promise<string | null> {
        const key = `one-time:${tokenHash}`;
        const userId = await this.redis.get(key);

        if (userId) {
            await this.redis.del(key);
            return userId;
        }
        return null;
    }
}