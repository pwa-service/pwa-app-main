import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

const JWKS = createRemoteJWKSet(new URL(process.env.AUTH_JWKS_URL ?? 'http://localhost:4000/.well-known/jwks.json'));
const ISS = process.env.AUTH_ISSUER ?? 'https://auth.local/';
const AUD = process.env.AUTH_AUDIENCE ?? 'api';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req: any = ctx.switchToHttp().getRequest();
        const auth = req.headers?.authorization as string | undefined;
        if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');

        const token = auth.slice(7);
        try {
            const { payload } = await jwtVerify(token, JWKS, { issuer: ISS, audience: AUD, algorithms: ['RS256'] });
            req.user = {
                id: String(payload.sub ?? ''),
                email: (payload['email'] as string) ?? '',
                name: (payload['name'] as string) ?? '',
                roles: (payload['roles'] as string[]) ?? [],
                raw: payload as JWTPayload,
            };
            return true;
        } catch (e: any) {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}
