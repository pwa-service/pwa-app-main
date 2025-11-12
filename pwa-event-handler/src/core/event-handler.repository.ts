import { Injectable } from '@nestjs/common';
import {MarkFirstOpenInput, UpsertSessionInput} from "../types/repository.types";
import {PrismaService} from "../../../pwa-prisma/src";

@Injectable()
export class EventHandlerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async upsertSession(input: UpsertSessionInput) {
        if (!input.sessionId) {
            const pixelToken = await this.findPixelTokenId(input.pixelId);

            if (!pixelToken) {
                throw new Error(`PixelToken with pixelFbId ${input.pixelId} not found.`);
            }
            return this.prisma.pwaSession.create({
                data: {
                    pwaDomain: input.pwaDomain,
                    landingUrl: input.landingUrl ?? null,
                    queryStringRaw: input.queryStringRaw ?? null,
                    pixelId: pixelToken.id,
                    fbclid: input.fbclid ?? null,
                    offerId: input.offerId ?? null,
                    utmSource: input.utmSource ?? null,
                    sub1: input.sub1 ?? null,
                }
            });
        }

        return this.prisma.pwaSession.update({
            where: {id: input.sessionId},
            data: {
                pwaDomain: input.pwaDomain,
                landingUrl: input.landingUrl ?? undefined,
                queryStringRaw: input.queryStringRaw ?? undefined,
                pixelId: input.pixelId.toString(),
                fbclid: input.fbclid ?? undefined,
                offerId: input.offerId ?? undefined,
                utmSource: input.utmSource ?? undefined,
                sub1: input.sub1 ?? undefined,
            }
        });
    }

    async getSessionById(id: string) {
        return this.prisma.pwaSession.findFirst({ where: { id } });
    }

    async findPixelTokenId(id: number | bigint | string) {
        return this.prisma.pixelToken.findFirst({ where: { id: id.toString() } });
    }

    async setFinalUrl(id: string, finalUrl: string): Promise<void> {
        await this.prisma.pwaSession.update({
            where: { id },
            data: { finalUrl },
        });
    }

    async markFirstOpen(input: MarkFirstOpenInput): Promise<void> {
        await this.prisma.pwaSession.updateMany({
            where: {
                id: input.sessionId,
                firstOpenAt: null,
            },
            data: {
                firstOpenAt: new Date(),
                firstOpenEventId: input.eventId ?? undefined,
                firstOpenFbStatus: input.fbStatus ?? undefined,
                finalUrl: input.finalUrl ?? undefined,
            },
        });
    }
}
