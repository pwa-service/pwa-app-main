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


class MailerServiceMock {
    sendMail = jest.fn().mockResolvedValue(undefined);
}

describe('AuthCoreService', () => {
    let service: AuthCoreService;
    let prisma: PrismaService;
    let repo: AuthRepository;
    let store: RefreshStore;
    let mailer: MailerServiceMock;

    const testEmail = 'auth_integration_test@example.com';
    const testPassword = 'Test1234!';
    const newPassword = 'NewTest1234!';
    const testName = 'integration-user';

    let userId: string;
    let accessToken: string;
    let refreshToken: string;
    let resetToken: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthCoreService,
                AuthRepository,
                PrismaService,
                { provide: RefreshStore, useClass: RefreshStore },
                { provide: MailerService, useClass: MailerServiceMock },
            ],
        }).compile();

        service = module.get(AuthCoreService);
        prisma = module.get(PrismaService);
        repo = module.get(AuthRepository);
        store = module.get(RefreshStore) as any;
        mailer = module.get(MailerService) as any;

        await prisma.user.deleteMany({ where: { email: testEmail } });
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

        const dbUser = await repo.findByEmailOrUsername(testEmail);

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

        const updatedUser = await repo.findByEmailOrUsername(testEmail);

        expect(updatedUser).toBeDefined();
        const ok = await bcrypt.compare(newPassword, updatedUser!.password);
        expect(ok).toBe(true);
    });

    it('confirmEmail', async () => {
        const dbUser = await repo.findByEmailOrUsername(testEmail);
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
});