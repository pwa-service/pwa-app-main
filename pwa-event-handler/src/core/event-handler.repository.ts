import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PrismaService } from '../../../pwa-prisma/src';
import { EventType } from '.prisma/client';
import { MarkFirstOpenInput, UpsertSessionInput } from '../common/types/repository.types';

@Injectable()
export class EventHandlerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async upsertSession(data: UpsertSessionInput) {
        const pixelToken = await this.prisma.pixelToken.findUnique({
            where: { id: data.pixelId.toString() },
        });

        if (!pixelToken) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Pixel token with ID ${data.pixelId} not found.`,
            });
        }

        if (!data.sessionId) {
            return this.prisma.pwaSession.create({
                data: {
                    pixelId: pixelToken.id,
                    queryStringRaw: data.queryStringRaw ?? null,
                },
            });
        }

        return this.prisma.pwaSession.update({
            where: { id: data.sessionId },
            data: {
                pixelId: pixelToken.id,
                queryStringRaw: data.queryStringRaw ?? undefined,
            },
        });
    }

    async getSessionById(id: string) {
        return this.prisma.pwaSession.findUnique({ where: { id } });
    }

    async findPixelTokenId(id: number | bigint | string) {
        return this.prisma.pixelToken.findUnique({
            where: { id: id.toString() }
        });
    }

    async isSessionEventLogExists(sessionId: string, event: EventType) {
        const count = await this.prisma.eventLog.count({
            where: {
                eventType: event,
                sessionId,
            },
        });
        return count > 0;
    }
}