import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'; // 👈 ВАЖЛИВО: Імпорт Prisma для Decimal
import { CreateEventLogPayload } from '../../../pwa-shared/src';
import { PrismaService } from 'pwa-prisma/src/prisma.service';

@Injectable()
export class LoggerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createEventLog(input: CreateEventLogPayload) {
        try {
            const revenueValue = input.revenue != null
                ? new Prisma.Decimal(input.revenue)
                : null;
            const countryValue = input.country || null;
            const clientIpValue = input.clientIp || null;
            const responseDataValue =
                input.responseData != null
                    ? (typeof input.responseData === 'string'
                        ? input.responseData
                        : JSON.stringify(input.responseData))
                    : null;

            const event = await this.prisma.eventLog.create({
                data: {
                    userId: input.userId,
                    pixelId: input.pixelId,
                    eventType: input.eventType,
                    eventId: input.eventId,
                    revenue: revenueValue,
                    country: countryValue,
                    clientIp: clientIpValue,
                    responseData: responseDataValue,
                    status: input.status,
                },
                select: { id: true },
            });
            return event.id;
        } catch (error) {
            throw error;
        }
    }
}