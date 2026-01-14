import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PrismaService } from '../../../pwa-prisma/src';
import { EventType } from '.prisma/client';
import { MarkFirstOpenInput, UpsertSessionInput } from '../types/repository.types';

@Injectable()
export class EventHandlerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async upsertSession(input: UpsertSessionInput) {
        const pixelToken = await this.prisma.pixelToken.findUnique({
            where: { id: input.pixelId.toString() },
        });

        if (!pixelToken) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Pixel token with ID ${input.pixelId} not found.`,
            });
        }

        if (!input.sessionId) {
            return this.prisma.pwaSession.create({
                data: {
                    pixelId: pixelToken.id,
                    queryStringRaw: input.queryStringRaw ?? null,
                },
            });
        }

        return this.prisma.pwaSession.update({
            where: { id: input.sessionId },
            data: {
                pixelId: pixelToken.id,
                queryStringRaw: input.queryStringRaw ?? undefined,
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