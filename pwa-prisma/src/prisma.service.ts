import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                'error',
                'warn',
            ],
        });
    }
    async onModuleInit() {
        // @ts-ignore
        this.$on('query', (e: any) => {
            console.log('--- PRISMA SQL QUERY ---');
            console.log('Query: ', e.query);
            console.log('Params:', e.params);
            console.log('------------------------');
        });
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
