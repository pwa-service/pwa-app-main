import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { AuthCoreService } from './auth.core.service';
import { RefreshStore } from '../../../pwa-shared/src/modules/auth/common/refresh.store';
import { AuthRepository } from './auth.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../../../pwa-prisma/src';
import * as bcrypt from 'bcryptjs';
import { jwtVerify, importJWK } from 'jose';
import * as crypto from 'crypto';
import {JwtVerifierService} from "../../../pwa-shared/src/modules/auth/jwt-verifier.service";
import {Counter} from "prom-client";


class MailerServiceMock {
    sendMail = jest.fn().mockResolvedValue(undefined);
}

describe('AuthCoreService', () => {
    let service: AuthCoreService;
    let prisma: PrismaService;
    let repo: AuthRepository;
    let store: RefreshStore;
    let mailer: MailerServiceMock;
    let jwt: JwtVerifierService;

    const testEmail = 'auth_integration_test@example.com';
    const testPassword = 'Test1234!';
    const newPassword = 'NewTest1234!';
    const testName = 'integration-user';

    let userId: string;
    let accessToken: string;
    let refreshToken: string;
    let resetToken: string;

    const counterChild = { inc: jest.fn() };
    const counterMock = {
        inc: jest.fn(),
        labels: jest.fn(() => counterChild),
    } as unknown as Counter<string>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthCoreService,
                AuthRepository,
                PrismaService,
                RefreshStore,
                JwtVerifierService,
                { provide: 'PROM_METRIC_AUTH_LOGIN_SUCCESS_TOTAL', useValue: counterMock },
                { provide: 'PROM_METRIC_AUTH_LOGIN_ERRORS_TOTAL', useValue: counterMock },
                { provide: MailerService, useClass: MailerServiceMock },
            ],
        }).compile();

        service = module.get(AuthCoreService);
        prisma = module.get(PrismaService);
        repo = module.get(AuthRepository);
        store = module.get(RefreshStore) as any;
        mailer = module.get(MailerService) as any;
        jwt = module.get(JwtVerifierService) as any;

        await prisma.user.deleteMany({ where: { email: testEmail } });
        await store.onModuleInit();
        await service.onModuleInit();
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: testEmail } });
        await prisma.$disconnect();
    });

    it('signUp', async () => {
        const res = await service.signUp({
            email: testEmail,
            password: testPassword,
            name: testName,
        } as any);

        expect(res.accessToken).toBeDefined();
        expect(res.refreshToken).toBeDefined();
        expect(res.user.email).toBe(testEmail);

        const dbUser = await repo.findByEmail(testEmail);

        expect(dbUser).toBeDefined();
        expect(dbUser!.email).toBe(testEmail);

        userId = String(dbUser!.id);
        accessToken = res.accessToken;
        refreshToken = res.refreshToken;
    });

    it('validateUser + issueTokens', async () => {
        const payload = await service.validateUser({
            email: testEmail,
            password: testPassword,
        } as any);

        expect(payload.id).toBe(userId);
        expect(payload.email).toBe(testEmail);

        const tokens = await service.issueTokens(payload);

        expect(tokens.accessToken).toBeDefined();
        expect(tokens.refreshToken).toBeDefined();

        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;

        const ok = await store.check(userId, refreshToken);
        expect(ok).toBe(true);
    });

    it('accessToken', async () => {
        const jwks = service.getJwks();
        const [jwk] = jwks.keys;
        const publicKey = await importJWK(jwk, 'RS256');

        const { payload } = await jwtVerify(accessToken, publicKey, {
            issuer: process.env.AUTH_ISSUER,
            audience: process.env.AUTH_AUDIENCE,
        });

        expect(payload.sub).toBe(userId);
        expect(payload.email).toBe(testEmail);
    });

    it('refreshByToken', async () => {
        const res = await service.refreshByToken(refreshToken);

        expect(res.accessToken).toBeDefined();
        expect(res.refreshToken).toBeDefined();
    });

    it('requestPasswordReset', async () => {
        const res = await service.requestPasswordReset(testEmail);

        resetToken = res.message;
        expect(typeof resetToken).toBe('string');
        expect(resetToken.length).toBe(64);

        expect(mailer.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: testEmail,
            }),
        );
    });

    it('restorePassword', async () => {
        const res = await service.restorePassword({
            email: testEmail,
            newPassword,
            token: resetToken,
        } as any);

        expect(res.accessToken).toBeDefined();
        expect(res.refreshToken).toBeDefined();

        const updatedUser = await repo.findByEmail(testEmail);

        expect(updatedUser).toBeDefined();
        const ok = await bcrypt.compare(newPassword, updatedUser!.password);
        expect(ok).toBe(true);
    });

    it('confirmEmail', async () => {
        const dbUser = await repo.findByEmail(testEmail);
        expect(dbUser).toBeDefined();

        const confirmToken = 'confirm_' + Math.random().toString(36).slice(2, 18);
        const exp = Math.floor(Date.now() / 1000) + 3600;
        await store.saveOneTime(confirmToken, dbUser!.id, exp);

        const res = await service.confirmEmail(confirmToken);

        expect(res.accessToken).toBeDefined();
        expect(res.refreshToken).toBeDefined();

        const after = await repo.findById(dbUser!.id);
        expect(after).toBeDefined();
    });

    it('refreshByToken (error case)', async () => {
        await expect(service.refreshByToken('')).rejects.toEqual(
            new RpcException({
                code: status.UNAUTHENTICATED,
                message: 'No refresh token provided',
            }),
        );
    });

    describe('telegramAuth', () => {
        process.env.TELEGRAM_BOT_TOKEN = '5762342430:AAG1Miw9VodQ00y4vvHxeZNmgAWHmriK6VQ'
        const botToken = process.env.TELEGRAM_BOT_TOKEN!;
        const telegramId = 123456789;
        const now = Math.floor(Date.now() / 1000);
        const generateHash = (data: any) => {
            const mapping: Record<string, string> = {
                authDate: 'auth_date',
                firstName: 'first_name',
                id: 'id',
                lastName: 'last_name',
                photoUrl: 'photo_url',
                username: 'username'
            };

            const checkData: Record<string, string> = {};
            for (const [camelKey, snakeKey] of Object.entries(mapping)) {
                const val = data[camelKey] ?? data[snakeKey];

                if (val !== undefined && val !== null && val !== '' && val !== 0 && val !== '0') {
                    checkData[snakeKey] = String(val);
                }
            }
            const dataCheckString = Object.keys(checkData)
                .sort()
                .map(key => `${key}=${checkData[key]}`)
                .join('\n');
            const secretKey = crypto.createHash('sha256').update(botToken).digest();
            return crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
        };

        it('should authenticate existing user via Telegram', async () => {
            const tgEmail = `tg_${telegramId}@telegram.user`;
            const authData = {
                id: telegramId,
                firstName: 'John',
                username: 'johndoe',
                authDate: now,
            };
            const hash = generateHash(authData);
            const res = await service.telegramAuth({
                ...authData,
                hash: hash,
            });

            if (res) {
                expect(res.accessToken).toBeDefined();
                expect(res.refreshToken).toBeDefined();
                expect(res.user.email).toBe(tgEmail);
            } else {
                fail('Test failed: res is undefined');
            }
        });

        it('should create NEW user via Telegram if not exists', async () => {
            const newTgId = 987654321;
            const authData = {
                id: newTgId,
                firstName: 'New',
                lastName: 'User',
                authDate: now,
            };
            const hash = generateHash(authData);

            const res = await service.telegramAuth({
                ...authData,
                hash: hash,
            });

            if (res) {
                expect(res.accessToken).toBeDefined();
            } else {
                fail('Test failed: res is undefined');
            }

            const dbUser = await repo.findByEmail(`tg_${newTgId}@telegram.user`);
            expect(dbUser).toBeDefined();
            expect(dbUser!.username).toBe(`tg_user_${newTgId}`);
        });

        it('should throw UNAUTHENTICATED if hash is invalid', async () => {
            const authData = {
                id: telegramId,
                authDate: now,
                hash: 'invalid_fake_hash',
            };

            await expect(service.telegramAuth(authData)).rejects.toEqual(
                new RpcException({
                    code: status.UNAUTHENTICATED,
                    message: 'Invalid Telegram hash (Integrity check failed)',
                }),
            );
        });

        it('should throw UNAUTHENTICATED if auth_date is too old', async () => {
            const oldDate = now - 86401;
            const authData = {
                id: telegramId,
                authDate: oldDate,
            };
            const hash = generateHash(authData);

            await expect(service.telegramAuth({ ...authData, hash })).rejects.toEqual(
                new RpcException({
                    code: status.UNAUTHENTICATED,
                    message: 'Telegram auth data is outdated',
                }),
            );
        });
    });
});