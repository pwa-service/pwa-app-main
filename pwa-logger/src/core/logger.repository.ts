import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {CreateEventLogPayload} from "../../../pwa-shared/src";
import { PrismaService } from 'pwa-prisma/src/prisma.service'

@Injectable()
export class LoggerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createEventLog(input: CreateEventLogPayload) {
        try {
            const rec = await this.prisma.eventLog.create({
                data: {
                    userId: input.userId,
                    pixelId: input.pixelId,
                    eventType: input.eventType,
                    eventId: input.eventId,
                    revenue: input.revenue,
                    country: input.country ?? null,
                    clientIp: input.clientIp ?? null,
                    responseData:
                        input.responseData != null
                            ? (typeof input.responseData === 'string'
                                ? input.responseData
                                : JSON.stringify(input.responseData))
                            : null,
                    status: input.status,
                },
                select: { id: true },
            });
            console.log("SUCSESS");
            return rec.id;
        } catch (error) {
            console.log("ERROR", error);
        }
    }
}
