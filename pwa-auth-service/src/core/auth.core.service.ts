import { Injectable } from '@nestjs/common';
import {
    exportJWK,
    generateKeyPair,
    importJWK,
    importPKCS8,
    jwtVerify,
    SignJWT,
} from 'jose';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import { RefreshStore } from '../../../pwa-shared/src/modules/auth/common/refresh.store';
import { AuthRepository } from './auth.repository';
import * as crypto from 'crypto';
import {MailerService} from "@nestjs-modules/mailer";
import {RestorePasswordDto, SignInDto, SignUpDto} from "../../../pwa-shared/src";

type UserPayload = { id: string; email: string; username: string };

@Injectable()
export class AuthCoreService {
    private privateKey!: CryptoKey;
    private publicJwk!: any;
    private kid!: string;

    constructor(
        private readonly store: RefreshStore,
        private readonly repo: AuthRepository,
        private readonly mailerService: MailerService,
    ) {}

    async onModuleInit() {
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


    async validateUser(input: SignInDto): Promise<UserPayload> {
        const { email: emailOrUsername, password } = input;
        const user = await this.repo.findByEmailOrUsername(emailOrUsername);
        if (!user) {
            throw new RpcException({
                code: status.UNAUTHENTICATED,
                message: 'Invalid credentials',
            });
        }

        const ok = await bcrypt.compare(password, user.password).catch(() => false);
        if (!ok) {
            throw new RpcException({
                code: status.UNAUTHENTICATED,
                message: 'Invalid credentials',
            });
        }

        return {
            id: String(user.id),
            email: user.email ?? '',
            username: user.username ?? '',
        };
    }

    async issueTokens(user: UserPayload) {
        try {
            const now = Math.floor(Date.now() / 1000);
            const ISS = process.env.AUTH_ISSUER ?? 'https://auth.local/';
            const AUD = process.env.AUTH_AUDIENCE ?? 'api';

            const accessTtl = Number(process.env.AUTH_ACCESS_TTL ?? 900);      // 15m
            const refreshTtl = Number(process.env.AUTH_REFRESH_TTL ?? 604800);  // 7d

            const accessToken = await new SignJWT({
                sub: user.id,
                email: user.email,
                username: user.username,
                roles: ['user'],
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
            throw new RpcException({
                code: status.UNAUTHENTICATED,
                message: 'No refresh token provided',
            });
        }
        try {
            const pub = await importJWK(this.publicJwk, 'RS256');
            const { payload } = await jwtVerify(refreshToken, pub, {
                audience: 'refresh',
                issuer: process.env.AUTH_ISSUER ?? 'https://auth.local/',
            });

            const ok = await this.store.check(String(payload.sub), refreshToken);
            if (!ok) {
                throw new RpcException({
                    code: status.UNAUTHENTICATED,
                    message: 'Refresh token invalid or expired',
                });
            }

            const dbUser = await this.repo.findById(payload.sub!);
            if (!dbUser) {
                throw new RpcException({
                    code: status.PERMISSION_DENIED,
                    message: 'User not found',
                });
            }

            const user: UserPayload = {
                id: String(dbUser.id),
                email: dbUser.email ?? '',
                username: dbUser.username ?? '',
            };
            return this.issueTokens(user);
        } catch (err: any) {
            if (err?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || err?.code === 'ERR_JWT_EXPIRED') {
                throw new RpcException({
                    code: status.UNAUTHENTICATED,
                    message: 'Invalid or expired refresh token',
                });
            }
            if (typeof err?.code === 'number') throw err;
            throw new RpcException({
                code: status.UNKNOWN,
                message: 'Token verification failed',
            });
        }
    }

    async signUp(input: SignUpDto) {
        const { email, name, password } = input;
        const existing = await this.repo.findByEmailOrUsername(email);
        if (existing) {
            throw new RpcException({
                code: status.ALREADY_EXISTS,
                message: 'User already exists',
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const created = await this.repo.createUser({
            email,
            password: hash,
            username: name ?? email.split('@')[0],
        });

        return this.issueTokens({
            id: String(created.id),
            email: created.email ?? '',
            username: created.username ?? '',
        });
    }

    async singOut(id?: string) {
        if (!id) throw new RpcException({ code: status.INVALID_ARGUMENT, message: 'Invalid user id' })
        await this.store.revoke(id)
    }

    async restorePassword(input: RestorePasswordDto) {
        const { email, newPassword, token } = input;
        const user = await this.repo.findByEmailOrUsername(email);
        if (!user) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: 'User not found',
            });
        }

        const storedUserId = await this.store.checkAndGetOneTime(token);
        if (storedUserId !== user.id) {
            throw new RpcException({
                code: status.UNAUTHENTICATED,
                message: 'Invalid or expired password reset token',
            });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        const updated = await this.repo.updatePassword(user.id, hash);
        await this.store.revoke(user.id);

        const userPayload: UserPayload = {
            id: String(updated.id),
            email: updated.email ?? '',
            username: updated.username ?? '',
        };

        return this.issueTokens(userPayload);
    }

    async requestPasswordReset(email: string) {
        const user = await this.repo.findByEmailOrUsername(email);
        if (!user || !user.email) {
            return { message: 'If user exists, reset email was sent.' };
        }

        const token = crypto.randomBytes(32).toString('hex');
        const exp = Math.floor(Date.now() / 1000) + 3600;
        await this.store.saveOneTime(token, user.id, exp);

        const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}&email=${user.email}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `Use this link to reset your password: ${resetLink}`,
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p>`,
        });

        return { message: token };
    }

    async confirmEmail(token: string) {
        const userId = await this.store.checkAndGetOneTime(token);

        if (!userId) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: 'Invalid or expired email confirmation token',
            });
        }

        const user = await this.repo.findById(userId);
        if (!user) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: 'User not found',
            });
        }

        const updated = await this.repo.markEmailConfirmed(user.id);
        const userPayload: UserPayload = {
            id: String(updated.id),
            email: updated.email ?? '',
            username: updated.username ?? '',
        };

        return this.issueTokens(userPayload);
    }
}