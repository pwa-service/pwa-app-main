import { Injectable } from '@nestjs/common';
import {MarkFirstOpenInput, UpsertSessionInput} from "../types/repository.types";
import {Status} from ".prisma/client";
import {PrismaService} from "../../../pwa-prisma/src";

@Injectable()
export class EventHandlerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getActiveAccessTokenByPixelId(pixelId: string): Promise<string | null> {
        const rec = await this.prisma.pixelToken.findFirst({
            where: { pixelId, status: Status.active },
            select: { accessToken: true },
        });
        return rec?.accessToken ?? null;
    }

    async upsertSession(input: UpsertSessionInput) {
        return this.prisma.pwaSession.upsert({
            where: { userId: input.userId },
            update: {
                pwaDomain: input.pwaDomain,
                landingUrl: input.landingUrl ?? undefined,
                queryStringRaw: input.queryStringRaw ?? undefined,
                pixelId: input.pixelId,
                fbclid: input.fbclid ?? undefined,
                offerId: input.offerId ?? undefined,
                utmSource: input.utmSource ?? undefined,
                sub1: input.sub1 ?? undefined,
            },
            create: {
                userId: input.userId,
                pwaDomain: input.pwaDomain,
                landingUrl: input.landingUrl ?? null,
                queryStringRaw: input.queryStringRaw ?? null,
                pixelId: input.pixelId,
                fbclid: input.fbclid ?? null,
                offerId: input.offerId ?? null,
                utmSource: input.utmSource ?? null,
                sub1: input.sub1 ?? null,
            },
        });
    }

    async getSessionByUserId(userId: string) {
        return this.prisma.pwaSession.findUnique({ where: { userId } });
    }

    async setFinalUrl(userId: string, finalUrl: string): Promise<void> {
        await this.prisma.pwaSession.update({
            where: { userId },
            data: { finalUrl },
        });
    }

    async markFirstOpen(input: MarkFirstOpenInput): Promise<void> {
        await this.prisma.pwaSession.update({
            where: { userId: input.userId },
            data: {
                firstOpenAt: new Date(),
                firstOpenEventId: input.eventId ?? undefined,
                firstOpenFbStatus: input.fbStatus ?? undefined,
                finalUrl: input.finalUrl ?? undefined,
            },
        });
    }
}
