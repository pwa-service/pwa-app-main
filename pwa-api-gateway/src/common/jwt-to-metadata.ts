import { Metadata } from '@grpc/grpc-js';
import { Request } from 'express';

export function buildGrpcMetadata(req: Request & { clientIp?: string }) {
    const md = new Metadata();

    const auth  = req.headers.authorization as string | undefined;
    const reqId = (req.headers['x-request-id'] as string | undefined) || undefined;
    if (auth?.startsWith('Bearer ')) md.add('authorization', auth);
    if (reqId) md.add('x-request-id', reqId);

    const ip =
        (req.headers['x-client-ip'] as string | undefined) ||
        (req.clientIp as string | undefined) ||
        (req.ip as string | undefined);
    if (ip) md.add('x-client-ip', ip);

    const ua = req.headers['user-agent'] as string | undefined;
    if (ua) md.add('x-client-ua', ua);

    return md;
}