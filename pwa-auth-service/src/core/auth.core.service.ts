import { Injectable } from '@nestjs/common';
import {
  exportJWK,
  generateKeyPair,
  importJWK,
  importPKCS8,
  jwtVerify,
  SignJWT,
} from 'jose';
import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';

import { RefreshStore } from '../common/refresh.store';
import { AuthRepository } from './auth.repository';

type UserPayload = { id: string; email: string; name: string };

@Injectable()
export class AuthCoreService {
  private privateKey!: CryptoKey;
  private publicJwk!: any;
  private kid!: string;

  constructor(
      private readonly store: RefreshStore,
      private readonly repo: AuthRepository,
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


  async validateUser(emailOrUsername: string, password: string): Promise<UserPayload> {
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
      name: user.username ?? '',
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
        name: user.name,
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

      const dbUser = await this.repo.findById(Number(payload.sub));
      if (!dbUser) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'User not found',
        });
      }

      const user: UserPayload = {
        id: String(dbUser.id),
        email: dbUser.email ?? '',
        name: dbUser.username ?? '',
      };
      return this.issueTokens(user);
    } catch (err: any) {
      if (err?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || err?.code === 'ERR_JWT_EXPIRED') {
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: 'Invalid or expired refresh token',
        });
      }
      if (typeof err?.code === 'number') throw err; // вже RpcException
      throw new RpcException({
        code: status.UNKNOWN,
        message: 'Token verification failed',
      });
    }
  }

  async tryVerifyAccess(accessToken: string) {
    if (!accessToken) return null;
    try {
      const pub = await importJWK(this.publicJwk, 'RS256');
      const { payload } = await jwtVerify(accessToken, pub, {
        audience: process.env.AUTH_AUDIENCE ?? 'api',
        issuer: process.env.AUTH_ISSUER ?? 'https://auth.local/',
      });
      return payload;
    } catch {
      return null;
    }
  }

  async signUp(email: string, password: string, name?: string) {
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
      username: email,
      password: hash,
      name: name ?? email.split('@')[0],
    });

    return this.issueTokens({
      id: String(created.id),
      email: created.email ?? '',
      name: created.username ?? '',
    });
  }

  async revokeByUserId(userId: string) {
    try {
      await this.store.revoke(userId);
    } catch {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to revoke refresh tokens',
      });
    }
  }

  async payloadFromMd(md: Metadata) {
    const access = this.extractAccessFromMd(md);
    if (!access) return null;
    return this.tryVerifyAccess(access);
  }

  async meFromMd(md: Metadata) {
    const payload = await this.payloadFromMd(md);
    if (!payload) return { id: 'unknown', email: '', name: '' };

    const dbUser = await this.repo.findById(Number(payload.sub));
    return {
      id: String(dbUser?.id ?? payload.sub ?? 'unknown'),
      email: dbUser?.email ?? (payload['email'] as string) ?? '',
      name: dbUser?.username ?? (payload['name'] as string) ?? '',
    };
  }

  async signOutFromMd(md: Metadata) {
    const payload = await this.payloadFromMd(md);
    if (payload?.sub) {
      await this.revokeByUserId(String(payload.sub));
    }
    return {};
  }

  private extractAccessFromMd(md: Metadata): string | null {
    const h = (md.get('authorization')[0] as string | undefined) ?? '';
    const token = h.replace(/^Bearer\s+/i, '').trim();
    return token || null;
  }
}
