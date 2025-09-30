import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

type Item = { token: string; exp: number };

@Injectable()
export class RefreshStore implements OnModuleInit {
    private data = new Map<string, Item>();
    private redis!: RedisClientType;

    async onModuleInit() {
        this.redis = createClient({
            url: `redis://${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? 6379}`,
        });
        this.redis.on('error', (err) => console.error('Redis Client Error', err));
        await this.redis.connect();
    }

    async save(userId: string, token: string, exp: number) {
        const ttl = exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
            await this.redis.setEx(`refresh:${userId}`, ttl, token);
        }
        this.data.set(userId, { token, exp });
    }

    async check(userId: string, token: string): Promise<boolean> {
        const now = Math.floor(Date.now() / 1000);
        const stored = await this.redis.get(`refresh:${userId}`);
        if (stored) {
            return stored === token;
        }

        const it = this.data.get(userId);
        return it ? it.token === token && it.exp > now : false;
    }

    async revoke(userId: string) {
        await this.redis.del(`refresh:${userId}`);
        this.data.delete(userId);
    }
}
