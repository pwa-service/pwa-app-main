import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

function getOriginalIp(req: Request): string {
    const xff = (req.headers['x-forwarded-for'] as string | undefined)
        ?.split(',')
        .map(s => s.trim());
    const candidate =
        (req.headers['cf-connecting-ip'] as string | undefined) ||
        (req.headers['true-client-ip'] as string | undefined) ||
        (xff && xff.length ? xff[0] : undefined) ||
        (req.headers['x-real-ip'] as string | undefined) ||
        (req.ip as string | undefined) ||
        (req.socket?.remoteAddress as string | undefined) ||
        '';

    return candidate.startsWith('::ffff:') ? candidate.slice(7) : candidate;
}

@Injectable()
export class ClientIpMiddleware implements NestMiddleware {
    use(req: Request & { clientIp?: string }, res: Response, next: NextFunction) {
        const ip = getOriginalIp(req);
        req.clientIp = ip;
        (req.headers as any)['x-client-ip'] = ip;
        res.setHeader('x-client-ip', ip);
        next();
    }
}
