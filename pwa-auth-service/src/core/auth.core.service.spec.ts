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
import { JwtVerifierService } from "../../../pwa-shared/src/modules/auth/jwt-verifier.service";
import { Counter } from "prom-client";
import { of } from 'rxjs';
import { ScopeType } from "../../../pwa-shared/src/types/org/roles/enums/scope.enum";
import { AccessLevel } from "../../../pwa-shared/src/types/org/sharing/enums/access.enum";

class MailerServiceMock {
    sendMail = jest.fn().mockResolvedValue(undefined);
}

const mockCampaignResponse = {
    id: 'campaign-uuid-123',
    name: 'Test Campaign',
    ownerId: 'owner-uuid',
    campaignUser: {
        campaignId: 'campaign-uuid-123',
        role: {
            id: 1,
            name: 'Owner',
            accessProfile: {
                accessProfile: {
                    globalRules: {
                        statAccess: AccessLevel.View,
                        finAccess: AccessLevel.Manage,
                        logAccess: AccessLevel.View,
                        usersAccess: AccessLevel.Manage,
                        sharingAccess: AccessLevel.Manage,
                    }
                }
            }
        }
    }
};

const mockCampaignGrpcService = {
    create: jest.fn().mockReturnValue(of(mockCampaignResponse))
};

const mockCampaignClient = {
    getService: jest.fn().mockReturnValue(mockCampaignGrpcService)
};

describe('AuthCoreService', () => {
    let service: AuthCoreService;
    let prisma: PrismaService;
    let repo: AuthRepository;
    let store: RefreshStore;
    let mailer: MailerServiceMock;

    const testEmail = 'rizoks29@gmail.com';
    const testPassword = 'Test1234!';
    const testUsername = 'integrationuser';
    const signUpEmail = 'newuser@gmail.com';
    const signUpUsername = 'newsignupuser';

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
                { provide: 'CAMPAIGN_PACKAGE', useValue: mockCampaignClient },
                { provide: 'ROLE_PACKAGE', useValue: { getService: () => ({}) } },
            ],
        }).compile();

        service = module.get(AuthCoreService);
        prisma = module.get(PrismaService);
        repo = module.get(AuthRepository);
        store = module.get(RefreshStore) as any;
        mailer = module.get(MailerService) as any;

        const emailsToDelete = [testEmail, signUpEmail];

        await prisma.campaignUser.deleteMany({
            where: {
                OR: [
                    { profile: { email: { in: emailsToDelete } } },
                    { campaignId: 'campaign-uuid-123' }
                ]
            }
        });

        await prisma.role.deleteMany({
            where: {
                OR: [
                    { name: 'Owner', campaignId: 'campaign-uuid-123' },
                    { campaignId: 'campaign-uuid-123' }
                ]
            }
        });

        await prisma.roleAccess.deleteMany({
            where: { accessProfile: { name: 'Owner Profile' } }
        });

        await prisma.accessProfile.deleteMany({
            where: { name: 'Owner Profile' }
        });

        await prisma.campaign.deleteMany({
            where: { id: 'campaign-uuid-123' }
        });

        await prisma.userProfile.deleteMany({
            where: { email: { in: emailsToDelete } }
        });


        await prisma.campaign.create({
            data: {
                id: 'campaign-uuid-123',
                name: 'Test Campaign For Auth Spec',
            }
        });
        const accessProfile = await prisma.accessProfile.create({
            data: {
                name: 'Owner Profile',
                globalRules: {
                    create: {
                        statAccess: AccessLevel.View,
                        finAccess: AccessLevel.Manage,
                        logAccess: AccessLevel.View,
                        usersAccess: AccessLevel.Manage,
                        sharingAccess: AccessLevel.Manage,
                    }
                },
            },
            include: { globalRules: true }
        });

        const role = await prisma.role.create({
            data: {
                name: 'Owner',
                scope: ScopeType.CAMPAIGN,
                campaignId: 'campaign-uuid-123',
                accessProfile: {
                    create: { accessProfileId: accessProfile.id }
                }
            }
        });

        const hash = await bcrypt.hash(testPassword, 10);
        const user = await repo.createBaseProfile({
            email: testEmail,
            username: testUsername,
            passwordHash: hash,
            scope: ScopeType.CAMPAIGN
        } as any);

        userId = user.id;

        await prisma.campaignUser.create({
            data: {
                userProfileId: userId,
                campaignId: 'campaign-uuid-123',
                roleId: role.id
            }
        });

        await store.onModuleInit();
        await service.onModuleInit();
    });

    afterAll(async () => {
        await prisma.campaignUser.deleteMany({
            where: { profile: { email: { in: [testEmail, signUpEmail] } } }
        });
        await prisma.userProfile.deleteMany({
            where: { email: { in: [testEmail, signUpEmail] } }
        });
        await prisma.$disconnect();
    });

    it('signUp (New User)', async () => {
        const res = await service.signUp({
            email: signUpEmail,
            password: testPassword,
            username: signUpUsername,
        } as any);

        expect(mockCampaignGrpcService.create).toHaveBeenCalled();

        expect((res as any).accessToken).toBeDefined();
        expect((res as any).refreshToken).toBeDefined();
        expect((res as any).user.email).toBe(signUpEmail);
        expect((res as any).user.scope).toBe(ScopeType.CAMPAIGN);

        expect((res as any).user.access.finAccess).toBe('Manage');
        const dbUser = await repo.findByEmail(signUpEmail);
        expect(dbUser).toBeDefined();
    });

    it('validateUser (Existing User from beforeAll)', async () => {
        const payload = await service.validateUser({
            email: testEmail,
            password: testPassword,
        } as any);

        expect(payload.id).toBe(userId);
        expect(payload.email).toBe(testEmail);
        expect(payload.access.finAccess).toBe('Manage');

        const tokens = await service.issueTokens(payload);
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;

        const ok = await store.check(userId, refreshToken);
        expect(ok).toBe(true);
    });

    it('accessToken structure', async () => {
        const jwks = service.getJwks();
        const [jwk] = jwks.keys;
        const publicKey = await importJWK(jwk, 'RS256');

        const { payload } = await jwtVerify(accessToken, publicKey, {
            issuer: process.env.AUTH_ISSUER,
            audience: process.env.AUTH_AUDIENCE,
        });

        expect(payload.sub).toBe(userId);
        expect(payload.email).toBe(testEmail);
        expect(payload.scope).toBe(ScopeType.CAMPAIGN);
        expect((payload.access as any).finAccess).toBe('Manage');
    });

    it('refreshByToken', async () => {
        const res = await service.refreshByToken(refreshToken);
        expect((res as any).accessToken).toBeDefined();
        expect((res as any).refreshToken).toBeDefined();
    });

    it('requestPasswordReset', async () => {
        const res = await service.requestPasswordReset(testEmail);
        resetToken = (res as any).message;
        expect(typeof resetToken).toBe('string');
        expect(mailer.sendMail).toHaveBeenCalled();
    });

    it('restorePassword', async () => {
        const res = await service.restorePassword({
            email: testEmail,
            newPassword: 'NewPassword123!',
            token: resetToken,
        } as any);
        expect((res as any).accessToken).toBeDefined();

        const updatedUser = await repo.findByEmail(testEmail);
        const ok = await bcrypt.compare('NewPassword123!', updatedUser!.passwordHash!);
        expect(ok).toBe(true);
    });

    it('confirmEmail', async () => {
        const confirmToken = 'confirm_' + Math.random().toString(36).slice(2, 18);
        const exp = Math.floor(Date.now() / 1000) + 3600;
        await store.saveOneTime(confirmToken, userId, exp);

        const res = await service.confirmEmail(confirmToken);
        expect((res as any).accessToken).toBeDefined();
    });

    describe('telegramAuth', () => {
        process.env.TELEGRAM_BOT_TOKEN = '5762342430:AAG1Miw9VodQ00y4vvHxeZNmgAWHmriK6VQ';
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

        const tgTestUsernames = ['tg_test_user_1', 'tg_test_user_new'];

        beforeAll(async () => {
            await prisma.userProfile.deleteMany({
                where: { username: { in: tgTestUsernames } }
            });

            const existingTgEmail = `tg_${telegramId}@telegram.user`;
            await repo.createBaseProfile({
                email: existingTgEmail,
                username: 'tg_test_user_1',
                passwordHash: 'dummy',
                scope: ScopeType.CAMPAIGN
            });
        });

        afterAll(async () => {
            await prisma.userProfile.deleteMany({
                where: { username: { in: tgTestUsernames } }
            });
        });

        it('should authenticate EXISTING user via Telegram', async () => {
            const uniqueUsername = 'tg_test_user_1';
            const tgEmail = `tg_${telegramId}@telegram.user`;

            const authData = {
                id: telegramId,
                firstName: 'John',
                username: uniqueUsername,
                authDate: now,
            };
            const hash = generateHash(authData);

            const res = await service.telegramAuth({
                ...authData,
                hash: hash,
            });

            expect((res as any).accessToken).toBeDefined();
            expect((res as any).user.email).toBe(tgEmail);
        });

        it('should return context message for NEW user', async () => {
            const newTgId = 987654321;
            const uniqueUsername = 'tg_test_user_new';

            const authData = {
                id: newTgId,
                firstName: 'New',
                username: uniqueUsername,
                authDate: now,
            };
            const hash = generateHash(authData);

            await prisma.userProfile.deleteMany({ where: { username: uniqueUsername } });

            const res = await service.telegramAuth({
                ...authData,
                hash: hash,
            } as any);

            expect((res as any).message).toBe("Context creation required");
        });

        it('should throw UNAUTHENTICATED if hash is invalid', async () => {
            const authData = {
                id: telegramId,
                authDate: now,
                hash: 'invalid_fake_hash',
            };

            await expect(service.telegramAuth(authData as any)).rejects.toEqual(
                new RpcException({
                    code: status.UNAUTHENTICATED,
                    message: 'Invalid Telegram hash',
                }),
            );
        });
    });
});