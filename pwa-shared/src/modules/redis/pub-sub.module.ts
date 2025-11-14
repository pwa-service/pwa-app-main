import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import {REDIS_PUBLISHER, REDIS_SUBSCRIBER} from "./pub-sub.providers";

export interface RedisPubSubModuleOptions {
    host: string;
    port: number;
    password?: string;
    prefix?: string;
}

@Global()
@Module({})
export class RedisPubSubModule {
    static register(options: RedisPubSubModuleOptions): DynamicModule {
        const redisSubscriberProvider: Provider = {
            provide: REDIS_SUBSCRIBER,
            useFactory: () => {
                return new Redis({
                    host: options.host,
                    port: options.port,
                    password: options.password,
                    prefix: options.prefix,
                } as any);
            },
        };

        const redisPublisherProvider: Provider = {
            provide: REDIS_PUBLISHER,
            useFactory: () => {
                return new Redis({
                    host: options.host,
                    port: options.port,
                    password: options.password,
                    prefix: options.prefix,
                } as any);
            },
        };

        return {
            module: RedisPubSubModule,
            providers: [redisPublisherProvider, redisSubscriberProvider],
            exports: [redisPublisherProvider, redisSubscriberProvider],
        };
    }
}