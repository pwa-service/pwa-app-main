import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateEventLogPayload } from '../../../pwa-shared/src';
import { PrismaService } from 'pwa-prisma/src/prisma.service';

@Injectable()
export class LoggerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createEventLog(input: CreateEventLogPayload) {
        try {
            const {
                revenue, countryName, countryCode, region: regionName,
                clientIp, responseData, sessionId, pixelId, eventType,
                eventId, userAgent, status
            } = input;

            const responseDataValue = responseData != null
                ? (typeof responseData === 'string' ? responseData : JSON.stringify(responseData))
                : null;

            let regionId: string | null = null;
            if (countryCode && countryName) {
                const country = await this.prisma.country.upsert({
                    where: { code: countryCode },
                    update: {},
                    create: {
                        code: countryCode,
                        name: countryName,
                        isActive: true
                    }
                });

                if (regionName) {
                    let region = await this.prisma.region.findFirst({
                        where: {
                            name: regionName,
                            countryId: country.id
                        }
                    });

                    if (!region) {
                        region = await this.prisma.region.create({
                            data: {
                                name: regionName,
                                countryId: country.id
                            }
                        });
                    }
                    regionId = region.id;
                }
            }

            const event = await this.prisma.eventLog.create({
                data: {
                    sessionId: sessionId,
                    pixelId: pixelId,
                    eventType: eventType,
                    eventId: eventId,
                    status: status,
                    regionId: regionId,
                    ipAddress: clientIp,
                    userAgent: userAgent,
                    responseData: responseDataValue,
                },
                select: { id: true },
            });

            const revenueValue = revenue != null ? new Prisma.Decimal(revenue) : null;
            if (revenueValue != null) {
                await this.prisma.sessionDeposit.create({
                    data: {
                        amount: revenueValue,
                        eventLogId: event.id,
                        depositedAt: new Date(),
                    }
                });
            }

            if (sessionId) {
                await this.linkLogToSession(sessionId, eventType, event.id);
            }

            return event.id;
        } catch (error) {
            console.error("Error creating event log:", error);
            throw error;
        }
    }

    private async linkLogToSession(sessionId: string, eventType: string, eventLogId: string) {
        switch (eventType) {
            case 'Purchase':
                await this.prisma.pwaSession.updateMany({
                    where: {
                        id: sessionId,
                        firstDepEventLogId: null
                    },
                    data: { firstDepEventLogId: eventLogId }
                });
                break;

            case 'CompleteRegistration':
                await this.prisma.pwaSession.update({
                    where: { id: sessionId },
                    data: { regEventLogId: eventLogId }
                });
                break;

            case 'Lead':
                await this.prisma.pwaSession.update({
                    where: { id: sessionId },
                    data: { leadEventLogId: eventLogId }
                });
                break;

            case 'Subscribe':
                await this.prisma.pwaSession.update({
                    where: { id: sessionId },
                    data: { subEventLogId: eventLogId }
                });
                break;

            case 'PageView':
            case 'ViewContent':
            default:
                await this.prisma.pwaSession.updateMany({
                    where: {
                        id: sessionId,
                        firstOpenEventLogId: null
                    },
                    data: { firstOpenEventLogId: eventLogId }
                });
                break;
        }
    }
}