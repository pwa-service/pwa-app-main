import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EventType, LogStatus } from '.prisma/client';
import { EventHandlerCoreService } from './event-handler.core.service';
import { EventHandlerRepository } from './event-handler.repository';
import { PrismaService } from '../../../pwa-prisma/src';
import {
    ViewContentDto,
    PwaFirstOpenDto,
    FbEventEnum,
    EventMeta,
} from '../../../pwa-shared/src';
import { FbEventDto } from '../../../pwa-shared/src/types/event-handler/dto/event.dto';
import { RpcException } from '@nestjs/microservices';
import { EventLogProducer } from '../queues/event-log.producer';
import { of } from 'rxjs';
import {Counter, Histogram} from "prom-client";

const testPixelId = process.env.TEST_PIXEL_ID || '1212908517317952';
const testPwaDomain = 'pwaservice.site';
const testUserAgent = 'Mozilla/5.0 (Linux; Android 9; SM-J730G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Mobile Safari/537.36'
const testIp = '168.197.219.100'

const mockGeoLookup = jest.fn().mockReturnValue({ country: 'UA' });
jest.mock('geoip-country', () => ({
    lookup: (ip: string) => mockGeoLookup(ip),
}));

class MockLogsProducer {
    createLog = jest.fn().mockResolvedValue(of({ success: true }));
}

describe('EventHandlerCoreService (integration)', () => {
    let service: EventHandlerCoreService;
    let prisma: PrismaService;
    let sessionId: string;

    const counterChild = { inc: jest.fn() };
    const counterMock = {
        inc: jest.fn(),
        labels: jest.fn(() => counterChild),
    } as unknown as Counter<string>;

    const histogramChild = {
        observe: jest.fn(),
        startTimer: jest.fn(() => jest.fn()),
    };

    const histogramMock = {
        observe: jest.fn(),
        startTimer: jest.fn(() => jest.fn()),
        labels: jest.fn(() => histogramChild),
    } as unknown as Histogram<string>;


    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventHandlerCoreService,
                EventHandlerRepository,
                PrismaService,
                { provide: 'PROM_METRIC_FB_CAPI_EVENTS_TOTAL', useValue: counterMock },
                { provide: 'PROM_METRIC_FB_CAPI_DURATION_SECONDS', useValue: histogramMock },
                { provide: EventLogProducer, useClass: MockLogsProducer },
            ],
        }).compile();

        service = module.get(EventHandlerCoreService);
        prisma = module.get(PrismaService);

        jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
        jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
        jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

        const eventMeta: EventMeta = {
            pixelId: testPixelId,
            fbclid: 'fb-test-1',
            offerId: 'offer-a',
            utmSource: 'fb-ad',
            clientIp: testIp,
            userAgent: testUserAgent,
            pwaDomain: testPwaDomain,
        };

        const dto: ViewContentDto & { _meta: EventMeta } = {
            pwaDomain: testPwaDomain,
            landingUrl: `https://${testPwaDomain}`,
            queryStringRaw: 'q=1',
            _meta: eventMeta,
        };

        const res = await service.viewContent(dto);
        sessionId = res.sessionId;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('viewContent', () => {
        it('should have created session in DB with that sessionId', async () => {
            const sessionInDb = await prisma.pwaSession.findUnique({
                where: { id: sessionId },
            });
            expect(sessionInDb).toBeDefined();
            expect(sessionInDb?.pwaDomain).toBe(testPwaDomain);
        });
    });

    describe('pwaFirstOpen', () => {
        const meta: EventMeta = {
            clientIp: testIp,
            userAgent: testUserAgent,
            pixelId: testPixelId,
            pwaDomain: testPwaDomain,
        };

        it('should send event and update firstOpenFbStatus', async () => {
            const dto: PwaFirstOpenDto & { _meta: EventMeta } = {
                sessionId,
                pwaDomain: testPwaDomain,
                _meta: meta,
            };

            const result = await service.pwaFirstOpen(dto);
            expect(result.success).toBe(true);

            const updated = await prisma.pwaSession.findUnique({ where: { id: sessionId } });
            expect(updated?.firstOpenFbStatus).toBe(LogStatus.success);
        });
    });

    describe('event() for different FbEventEnum', () => {
        const baseMeta: EventMeta = {
            clientIp: testIp,
            userAgent: testUserAgent,
            pixelId: testPixelId,
            pwaDomain: testPwaDomain,
        };

        const makeDto = (): FbEventDto & { _meta: EventMeta } => ({
            sessionId,
            pwaDomain: testPwaDomain,
            value: 99.99,
            currency: 'USD',
            _meta: baseMeta,
        });

        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
            jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
            jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
        });

        it('Reg → CompleteRegistration success', async () => {
            const dto = makeDto();
            const result = await service.event(FbEventEnum.Reg, dto);

            expect(result.success).toBe(true);
        });

        it('Dep → Purchase success', async () => {
            const dto = makeDto();
            const result = await service.event(FbEventEnum.Dep, dto);

            expect(result.success).toBe(true);
        });

        it('Redep → Purchase success without unique-check', async () => {
            const dto = makeDto();
            const result = await service.event(FbEventEnum.Redep, dto);
            expect(result.success).toBe(true);
        });

        it('Subscribe → Subscribe success', async () => {
            const dto = makeDto();
            const result = await service.event(FbEventEnum.Subscribe, dto);

            expect(result.success).toBe(true);
        });

        it('should throw RpcException if event already logged (non-Redep)', async () => {
            const dto = makeDto();
            await prisma.eventLog.create({
                data: {
                    sessionId,
                    pixelId: testPixelId,
                    eventType: EventType.Purchase,
                    eventId: 'test-event',
                    status: LogStatus.success,
                },
            });

            await expect(service.event(FbEventEnum.Dep, dto)).rejects.toBeInstanceOf(RpcException);
        });
    });

    afterAll(async () => {
        if (sessionId) {
            await prisma.eventLog.deleteMany({
                where: { sessionId },
            });

            await prisma.pwaSession.deleteMany({
                where: { id: sessionId },
            });
        }

        await prisma.$disconnect();
    });
});
