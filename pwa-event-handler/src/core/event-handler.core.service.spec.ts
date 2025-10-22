import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { of } from 'rxjs';
import { EventType, LogStatus } from '.prisma/client';
import { EventHandlerCoreService } from './event-handler.core.service';
import { EventHandlerRepository } from './event-handler.repository';
import { EventLogProducer } from '../queues/event-log.producer';
import {
    ViewContentDto, EventMeta, LeadDto, PwaFirstOpenDto,
    CompleteRegistrationDto, PurchaseDto, SubscribeDto
} from '../../../pwa-shared/src';

const mockSession = {
    id: '544d922f-9bc4-4826-aba3-732df66a0515',
    pixelId: '1000',
    pwaDomain: 'app.local',
    landingUrl: 'https://app.local/land',
    finalUrl: 'https://tracker.local/final',
    fbclid: 'fb-test-1',
    offerId: 'offer-a',
    utmSource: 'fb-ad',
};

class MockRepo {
    upsertSession = jest.fn();
    getSessionById = jest.fn();
    markFirstOpen = jest.fn();
}

class MockLogsProducer {
    createLog = jest.fn().mockResolvedValue(of({ success: true }));
}

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockGeoLookup = jest.fn().mockReturnValue({ country: 'UA' });

jest.mock('geoip-country', () => ({
    lookup: (ip: string) => mockGeoLookup(ip),
}));


describe('EventHandlerCoreService', () => {
    let service: EventHandlerCoreService;
    let repo: MockRepo;
    let logs: MockLogsProducer;

    const loggerInstance = new Logger(EventHandlerCoreService.name);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventHandlerCoreService,
                { provide: EventHandlerRepository, useClass: MockRepo },
                { provide: EventLogProducer, useClass: MockLogsProducer },
                { provide: Logger, useValue: loggerInstance },
            ],
        }).compile();

        service = new EventHandlerCoreService(module.get(EventHandlerRepository) as any, module.get(EventLogProducer) as any);
        repo = module.get(EventHandlerRepository) as MockRepo;
        logs = module.get(EventLogProducer) as MockLogsProducer;

        jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
        jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
        jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

        // Встановлення моків на інстансі перед кожним тестом
        repo.upsertSession.mockResolvedValue({ id: mockSession.id });
        repo.getSessionById.mockResolvedValue(mockSession);
        jest.clearAllMocks();
    });


    describe('viewContent', () => {
        const eventMeta: EventMeta = {
            pixelId: '1000', fbclid: 'fb-test', offerId: 'offer', utmSource: 'src',
            clientIp: '1.1.1.1', userAgent: 'test-agent',
        };
        const dto: ViewContentDto & { _meta: EventMeta } = {
            pwaDomain: 'test.app', landingUrl: 'https://test.app/page', queryStringRaw: 'q=1',
            _meta: eventMeta
        };

        it('should successfully upsert session, send to FB, and log success', async () => {
            mockedAxios.post.mockResolvedValue({ data: { fbtrace_id: 'fb-trace-123' }, status: 200 });

            const result = await service.viewContent(dto);

            expect(result.success).toBe(true);
            expect(repo.upsertSession).toHaveBeenCalled();
        });

        it('should handle FB API error and return success: false', async () => {
            mockedAxios.post.mockRejectedValue({ response: { status: 400, data: { error: 'Invalid access token' } }, isAxiosError: true });

            const result = await service.viewContent(dto);

            expect(result.success).toBe(false);
            expect(result.fb).toContain('FB 400');
            expect(logs.createLog).toHaveBeenCalledWith(expect.objectContaining({ status: LogStatus.error }));
        });
    });


    describe('lead', () => {
        const eventMeta: EventMeta = { clientIp: '1.1.1.1', userAgent: 'test-agent', pixelId: '1000' };
        const dto: LeadDto & { _meta: EventMeta } = { sessionId: mockSession.id, pwaDomain: 'test.app', _meta: eventMeta };

        it('should successfully send Lead event and log', async () => {
            mockedAxios.post.mockResolvedValue({ data: {}, status: 200 });
            const result = await service.lead(dto);
            expect(result.success).toBe(true);
            expect(repo.getSessionById).toHaveBeenCalledWith(mockSession.id);
            expect(logs.createLog).toHaveBeenCalledWith(
                expect.objectContaining({ eventType: EventType.Lead, status: LogStatus.success }),
            );
        });

        it('should return silent success if session is NOT found', async () => {
            repo.getSessionById.mockResolvedValue(null);
            const result = await service.lead(dto);
            expect(result.success).toBe(true);
            expect(result.fb).toContain('Session not found');
            expect(mockedAxios.post).not.toHaveBeenCalled();
        });
    });


    describe('pwaFirstOpen', () => {
        const eventMeta: EventMeta = { clientIp: '1.1.1.1', userAgent: 'test-agent', pixelId: '1000' };
        const dto: PwaFirstOpenDto & { _meta: EventMeta } = { sessionId: mockSession.id, pwaDomain: 'test.app', _meta: eventMeta };

        it('should successfully send ViewContent (on open) and mark open', async () => {
            mockedAxios.post.mockResolvedValue({ data: { fbtrace_id: 'open-trace' }, status: 200 });
            repo.getSessionById.mockResolvedValue(mockSession);

            const result = await service.pwaFirstOpen(dto);

            expect(result.success).toBe(true);
            expect(repo.markFirstOpen).toHaveBeenCalledWith(
                expect.objectContaining({ sessionId: mockSession.id, fbStatus: LogStatus.success }),
            );
        });

        it('should mark first open as ERROR if FB API fails', async () => {
            mockedAxios.post.mockRejectedValue({ response: { status: 400, data: { error: 'Permission Denied' } }, isAxiosError: true });
            repo.getSessionById.mockResolvedValue(mockSession);

            const result = await service.pwaFirstOpen(dto);

            expect(result.success).toBe(false);
            expect(repo.markFirstOpen).toHaveBeenCalledWith(
                expect.objectContaining({ fbStatus: LogStatus.error }),
            );
        });
    });


    describe('completeRegistration', () => {
        const eventMeta: EventMeta = { clientIp: '1.1.1.1', userAgent: 'test-agent', pixelId: '1000' };
        const dto: CompleteRegistrationDto & { _meta: EventMeta } = { sessionId: mockSession.id, pwaDomain: 'test.app', _meta: eventMeta };

        it('should send CompleteRegistration event on session and log success', async () => {
            mockedAxios.post.mockResolvedValue({ data: {}, status: 200 });
            const result = await service.completeRegistration(dto);
            expect(result.success).toBe(true);
            expect(repo.getSessionById).toHaveBeenCalledWith(mockSession.id);
            expect(logs.createLog).toHaveBeenCalledWith(
                expect.objectContaining({ eventType: EventType.CompleteRegistration, status: LogStatus.success }),
            );
        });

        it('should handle FB API error and return success: false', async () => {
            mockedAxios.post.mockRejectedValue({ response: { status: 500, data: { error: 'FB Internal Error' } }, isAxiosError: true });
            const result = await service.completeRegistration(dto);
            expect(result.success).toBe(false);
            expect(result.fb).toContain('FB 500');
            expect(logs.createLog).toHaveBeenCalledWith(expect.objectContaining({ status: LogStatus.error }));
        });
    });


    describe('purchase', () => {
        const eventMeta: EventMeta = { clientIp: '1.1.1.1', userAgent: 'test-agent', pixelId: '1000' };
        const dto: PurchaseDto & { _meta: EventMeta } = {
            sessionId: mockSession.id, pwaDomain: 'test.app', value: 99.99, currency: 'USD', _meta: eventMeta
        };

        it('should send Purchase event with value/currency and log success', async () => {
            mockedAxios.post.mockResolvedValue({ data: {}, status: 200 });
            const result = await service.purchase(dto);
            expect(result.success).toBe(true);
            expect(logs.createLog).toHaveBeenCalledWith(
                expect.objectContaining({ eventType: EventType.Purchase, status: LogStatus.success }),
            );
        });

        it('should handle FB API error and return success: false', async () => {
            mockedAxios.post.mockRejectedValue({ response: { status: 500, data: { error: 'FB Internal Error' } }, isAxiosError: true });
            const result = await service.purchase(dto);
            expect(result.success).toBe(false);
            expect(logs.createLog).toHaveBeenCalledWith(expect.objectContaining({ status: LogStatus.error }));
        });
    });


    describe('subscribe', () => {
        const eventMeta: EventMeta = { clientIp: '1.1.1.1', userAgent: 'test-agent', pixelId: '1000' };
        const dto: SubscribeDto & { _meta: EventMeta } = {
            sessionId: mockSession.id, pwaDomain: 'test.app', value: 19.99, currency: 'EUR', _meta: eventMeta
        };

        it('should send Subscribe event and log success', async () => {
            mockedAxios.post.mockResolvedValue({ data: {}, status: 200 });
            const result = await service.subscribe(dto);
            expect(result.success).toBe(true);
            expect(logs.createLog).toHaveBeenCalledWith(
                expect.objectContaining({ eventType: EventType.Subscribe, status: LogStatus.success }),
            );
        });

        it('should handle FB API error and return success: false', async () => {
            mockedAxios.post.mockRejectedValue({ response: { status: 401, data: { error: 'Unauthorized' } }, isAxiosError: true });
            const result = await service.subscribe(dto);
            expect(result.success).toBe(false);
            expect(logs.createLog).toHaveBeenCalledWith(expect.objectContaining({ status: LogStatus.error }));
        });
    });
});