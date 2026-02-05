import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
    exportJWK,
    generateKeyPair,
    importJWK,
    importPKCS8,
    jwtVerify,
    SignJWT,
} from 'jose';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MailerService } from "@nestjs-modules/mailer";
import { Counter } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import {firstValueFrom, Observable} from 'rxjs';

import { RefreshStore } from '../../../pwa-shared/src/modules/auth/common/refresh.store';
import { AuthRepository } from './auth.repository';
import { RestorePasswordDto, SignInDto, SignUpDto } from "../../../pwa-shared/src";
import { TelegramAuthDto } from "../../../pwa-shared/src/types/auth/dto/telegram-auth.dto";
import { ScopeType } from "../../../pwa-shared/src/types/org/roles/enums/scope.enum";
import { JwtVerifierService } from "../../../pwa-shared/src/modules/auth/jwt-verifier.service";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";


interface CampaignGrpcService {
    create(data: { name: string; ownerId: string; description?: string }): Observable<any>;
}

@Injectable()
export class AuthCoreService implements OnModuleInit {
    private privateKey!: CryptoKey;
    private publicJwk!: any;
    private kid!: string;
    private campaignService: CampaignGrpcService;

    constructor(
        @InjectMetric('auth_login_success_total') public loginSuccessCounter: Counter,
        @InjectMetric('auth_login_errors_total') public loginErrorCounter: Counter,
        private readonly store: RefreshStore,
        private readonly repo: AuthRepository,
        private readonly mailerService: MailerService,
        private readonly jwt: JwtVerifierService,
        @Inject('CAMPAIGN_PACKAGE') private campaignClient: ClientGrpc,
    ) {}

    async onModuleInit() {
        this.campaignService = this.campaignClient.getService<CampaignGrpcService>('CampaignService');

        try {
            const pem = process.env.AUTH_PRIVATE_KEY_PEM;

            if (pem) {
                this.privateKey = await importPKCS8(pem, 'RS256');
            } else {
                const { privateKey, publicKey } = await generateKeyPair('RS256');
                this.privateKey = privateKey;
                this.publicJwk = await exportJWK(publicKey);
            }

            this.kid = process.env.AUTH_KEY_ID ?? 'dev-key';

            if (!this.publicJwk) {
                const { publicKey } = await generateKeyPair('RS256');
                this.publicJwk = await exportJWK(publicKey);
            }

            this.publicJwk.kid = this.kid;
            this.publicJwk.use = 'sig';
            this.publicJwk.alg = 'RS256';
        } catch {
            throw new RpcException({
                code: status.INTERNAL,
                message: 'Failed to initialize keys',
            });
        }
    }

    getJwks() {
        return { keys: [this.publicJwk] };
    }

    async validateUser(input: SignInDto) {
        const { email, password } = input;
        const user = await this.repo.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.passwordHash as string))) {
            this.loginErrorCounter.labels('email').inc();
            throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid credentials' });
        }

        this.loginSuccessCounter.labels('email').inc();

        let contextUser = null;
        if (user.scope === ScopeType.SYSTEM) contextUser = user.systemUser;
        else if (user.scope === ScopeType.CAMPAIGN) contextUser = user.campaignUser;
        else if (user.scope === ScopeType.TEAM) contextUser = user.teamUser;

        return this.mapUserToPayload(user, contextUser);
    }

    async issueTokens(user: UserPayload) {
        try {
            const now = Math.floor(Date.now() / 1000);
            const ISS = process.env.AUTH_ISSUER ?? 'https://auth.local/';
            const AUD = process.env.AUTH_AUDIENCE ?? 'api';

            const accessTtl = Number(process.env.AUTH_ACCESS_TTL ?? 900);
            const refreshTtl = Number(process.env.AUTH_REFRESH_TTL ?? 604800);

            const accessToken = await new SignJWT({
                sub: user.id,
                email: user.email,
                username: user.username,
                scope: user.scope,
                contextId: user.contextId,
                access: user.access
            })
                .setProtectedHeader({ alg: 'RS256', kid: this.kid, typ: 'JWT' })
                .setIssuedAt(now)
                .setIssuer(ISS)
                .setAudience(AUD)
                .setExpirationTime(now + accessTtl)
                .sign(this.privateKey);

            const refreshToken = await new SignJWT({ sub: user.id, typ: 'refresh' })
                .setProtectedHeader({ alg: 'RS256', kid: this.kid, typ: 'JWT' })
                .setIssuedAt(now)
                .setIssuer(ISS)
                .setAudience('refresh')
                .setExpirationTime(now + refreshTtl)
                .sign(this.privateKey);

            await this.store.save(user.id, refreshToken, now + refreshTtl);

            return {
                accessToken,
                refreshToken,
                expiresIn: accessTtl,
                user,
            };
        } catch {
            throw new RpcException({
                code: status.INTERNAL,
                message: 'Failed to issue tokens',
            });
        }
    }

    async refreshByToken(refreshToken: string) {
        if (!refreshToken) {
            throw new RpcException({ code: status.UNAUTHENTICATED, message: 'No refresh token provided' });
        }
        try {
            const pub = await importJWK(this.publicJwk, 'RS256');
            const { payload } = await jwtVerify(refreshToken, pub, {
                audience: 'refresh',
                issuer: process.env.AUTH_ISSUER ?? 'https://auth.local/',
            });

            const ok = await this.store.check(String(payload.sub), refreshToken);
            if (!ok) {
                throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Refresh token invalid or expired' });
            }

            const dbUser = await this.repo.findById(payload.sub!);
            if (!dbUser) {
                throw new RpcException({ code: status.PERMISSION_DENIED, message: 'User not found' });
            }

            let contextUser = null;
            if (dbUser.scope === ScopeType.SYSTEM) contextUser = dbUser.systemUser;
            else if (dbUser.scope === ScopeType.CAMPAIGN) contextUser = dbUser.campaignUser;
            else if (dbUser.scope === ScopeType.TEAM) contextUser = dbUser.teamUser;

            return this.issueTokens(this.mapUserToPayload(dbUser, contextUser));

        } catch (err: any) {
            if (err?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || err?.code === 'ERR_JWT_EXPIRED') {
                throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid or expired refresh token' });
            }
            throw new RpcException({ code: status.UNKNOWN, message: 'Token verification failed' });
        }
    }

    async orgSignUp(dto: SignUpDto) {
        const { email, username, password } = dto;

        const [emailRes, usernameRes] = await Promise.all([
            this.repo.findByEmail(email),
            this.repo.findByUsername(username)
        ]);

        if (emailRes) throw new RpcException({ code: status.ALREADY_EXISTS, message: 'Email exists' });
        if (usernameRes) throw new RpcException({ code: status.ALREADY_EXISTS, message: 'Username taken' });

        const hash = await bcrypt.hash(password, 10);

        try {
            const profile = await this.repo.createBaseProfile({
                email,
                username: username ?? email.split('@')[0],
                passwordHash: hash,
                scope: ScopeType.TEAM
            });
            return {
                id: profile.id,
                email: profile.email,
                username: profile.username
            };

        } catch (e) {
            throw new RpcException({ code: status.INTERNAL, message: `Org Registration failed: ${(e as any).message}` });
        }
    }

    async signUp(dto: SignUpDto) {
        const { email, username, password } = dto;
        const [emailRes, usernameRes] = await Promise.all([
            this.repo.findByEmail(email),
            this.repo.findByUsername(username)
        ]);

        if (emailRes) throw new RpcException({ code: status.ALREADY_EXISTS, message: 'Email exists' });
        if (usernameRes) throw new RpcException({ code: status.ALREADY_EXISTS, message: 'Username taken' });
        const hash = await bcrypt.hash(password, 10);

        try {
            const profile = await this.repo.createBaseProfile({
                email,
                username: username ?? email.split('@')[0],
                passwordHash: hash,
                scope: ScopeType.CAMPAIGN
            });

            const campaignResponse = await firstValueFrom(this.campaignService.create({
                name: `${username}'s Campaign`,
                ownerId: profile.id
            }));

            await this.sendConfirmationEmail(email, profile.id);
            return this.issueTokens(this.mapUserToPayload(profile, campaignResponse.campaignUser));

        } catch (e) {
            throw new RpcException({ code: status.INTERNAL, message: `Registration failed: ${(e as any).message}` });
        }
    }

    async singOut(id?: string) {
        if (!id) throw new RpcException({ code: status.INVALID_ARGUMENT, message: 'Invalid user id' })
        await this.store.revoke(id)
    }

    async restorePassword(input: RestorePasswordDto) {
        const { email, newPassword, token } = input;
        const user = await this.repo.findByEmail(email);
        if (!user) throw new RpcException({ code: status.NOT_FOUND, message: 'User not found' });

        const storedUserId = await this.store.checkAndGetOneTime(token);
        if (storedUserId !== user.id) throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid token' });

        const hash = await bcrypt.hash(newPassword, 10);
        await this.repo.updatePassword(user.id, hash);
        await this.store.revoke(user.id);

        let contextUser = null;
        if (user.scope === ScopeType.SYSTEM) contextUser = user.systemUser;
        else if (user.scope === ScopeType.CAMPAIGN) contextUser = user.campaignUser;
        else if (user.scope === ScopeType.TEAM) contextUser = user.teamUser;

        return this.issueTokens(this.mapUserToPayload(user, contextUser));
    }

    async requestPasswordReset(email: string) {
        const user = await this.repo.findByEmail(email);
        if (!user || !user.email) throw new RpcException({ code: status.NOT_FOUND, message: 'User not found' });

        const token = crypto.randomBytes(32).toString('hex');
        const exp = Math.floor(Date.now() / 1000) + 3600;
        await this.store.saveOneTime(token, user.id, exp);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${user.email}`;
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
        });
        return { message: token };
    }

    async confirmEmail(token: string) {
        const userId = await this.store.checkAndGetOneTime(token);
        if (!userId) throw new RpcException({ code: status.NOT_FOUND, message: 'Invalid token' });

        const user = await this.repo.findById(userId);
        if (!user) throw new RpcException({ code: status.NOT_FOUND, message: 'User not found' });

        const updated = await this.repo.markEmailConfirmed(user.id);

        const refreshedUser = await this.repo.findById(updated.id);

        let contextUser = null;
        if (refreshedUser) {
            if (refreshedUser.scope === ScopeType.SYSTEM) contextUser = refreshedUser.systemUser;
            else if (refreshedUser.scope === ScopeType.CAMPAIGN) contextUser = refreshedUser.campaignUser;
            else if (refreshedUser.scope === ScopeType.TEAM) contextUser = refreshedUser.teamUser;
        } else {
            throw new RpcException({ code: status.NOT_FOUND, message: 'User not found' });
        }

        return this.issueTokens(this.mapUserToPayload(refreshedUser, contextUser));
    }

    async validateToken(token: string) {
        if (!token) throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Missing token' });

        try {
            const payload = await this.jwt.verify(token);
            const sub = String(payload.sub ?? '');

            if (!sub) {
                await this.store.revoke(String(sub));
                throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid token' });
            }

            const user = await this.repo.findById(sub);
            if (!user) throw new RpcException({ code: status.PERMISSION_DENIED, message: 'User not found' });

            let contextUser = null;
            if (user.scope === ScopeType.SYSTEM) contextUser = user.systemUser;
            else if (user.scope === ScopeType.CAMPAIGN) contextUser = user.campaignUser;
            else if (user.scope === ScopeType.TEAM) contextUser = user.teamUser;

            return this.mapUserToPayload(user, contextUser);

        } catch (e) {
            if (e instanceof RpcException) throw e;
            throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Token validation failed' });
        }
    }

    async telegramAuth(dto: TelegramAuthDto) {
        try {
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            if (!botToken) throw new RpcException({ code: status.INTERNAL, message: 'Bot token not configured' });

            const checkData: Record<string, string> = {};
            const fieldMapping: Record<string, string> = {
                authDate: 'auth_date',
                firstName: 'first_name',
                id: 'id',
                lastName: 'last_name',
                photoUrl: 'photo_url',
                username: 'username'
            };

            for (const [camelKey, snakeKey] of Object.entries(fieldMapping)) {
                const val = dto[camelKey as keyof TelegramAuthDto];
                if (val !== undefined && val !== null && val !== '' && val !== 0 && val !== '0') {
                    checkData[snakeKey] = String(val);
                }
            }

            const dataCheckString = Object.keys(checkData)
                .sort()
                .map(key => `${key}=${checkData[key]}`)
                .join('\n');

            const secretKey = crypto.createHash('sha256').update(botToken).digest();
            const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

            if (hmac !== dto.hash) throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid Telegram hash' });

            const now = Math.floor(Date.now() / 1000);
            if (now - Number(dto.authDate) > 86400) throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Telegram auth expired' });

            const telegramEmail = `tg_${dto.id}@telegram.user`;
            let user = await this.repo.findByEmail(telegramEmail);

            if (!user) {
                return { message: "Context creation required" };
            }

            let contextUser = null;
            if (user.scope === ScopeType.SYSTEM) contextUser = user.systemUser;
            else if (user.scope === ScopeType.CAMPAIGN) contextUser = user.campaignUser;
            else if (user.scope === ScopeType.TEAM) contextUser = user.teamUser;

            return this.issueTokens(this.mapUserToPayload(user, contextUser));

        } catch (e) {
            if (e instanceof RpcException) throw e;
            throw new RpcException({ code: status.INTERNAL, message: `Telegram auth error: ${e}` });
        }
    }

    private async sendConfirmationEmail(email: string, userId: string) {
        const token = crypto.randomBytes(32).toString('hex');
        const exp = Math.floor(Date.now() / 1000) + 3600;
        await this.store.saveOneTime(token, userId, exp);

        const confirmLink = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
        await this.mailerService.sendMail({
            to: email,
            subject: 'Email confirm',
            html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
        });
    }

    private mapUserToPayload(profile: any, contextUser: any): UserPayload {
        const rawAccess = contextUser?.role?.accessProfile?.accessProfile ||
            contextUser?.role?.accessProfile ||
            {};

        return {
            id: profile.id,
            email: profile.email,
            username: profile.username,
            scope: profile.scope,
            contextId: contextUser?.campaignId || contextUser?.teamId || null,
            access: {
                statAccess: rawAccess.statAccess || 'None',
                finAccess: rawAccess.finAccess || 'None',
                logAccess: rawAccess.logAccess || 'None',
                usersAccess: rawAccess.usersAccess || 'None',
                sharingAccess: rawAccess.sharingAccess || false,
            }
        };
    }
}