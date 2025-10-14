import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class JwtVerifierService implements OnModuleDestroy {
    private jwks!: ReturnType<typeof createRemoteJWKSet>;

    onModuleDestroy() {}

    private getJwks() {
        if (!this.jwks) {
            const url = new URL(process.env.AUTH_JWKS_URL ?? 'http://auth-service:4000/.well-known/jwks.json');
            this.jwks = createRemoteJWKSet(url);
        }
        return this.jwks;
    }

    async verify(accessToken: string): Promise<JWTPayload> {
        const ISS = process.env.AUTH_ISSUER ?? 'https://auth.local/';
        const AUD = process.env.AUTH_AUDIENCE ?? 'api';
        const { payload } = await jwtVerify(accessToken, this.getJwks(), { issuer: ISS, audience: AUD });
        return payload;
    }
}
