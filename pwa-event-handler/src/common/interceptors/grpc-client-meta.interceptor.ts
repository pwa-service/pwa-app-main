import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

function metaStr(md: Metadata | undefined, key: string): string | undefined {
    const v = md?.get(key)?.[0];
    if (typeof v === 'string') return v;
    if (Buffer.isBuffer(v)) return v.toString('utf8');
    return undefined;
}

@Injectable()
export class GrpcClientMetaInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        if (ctx.getType() !== 'rpc') return next.handle();

        const md = ctx.getArgByIndex(1) as Metadata | undefined;
        const data = ctx.switchToRpc().getData() as Record<string, any>;

        const clientIp  = metaStr(md, 'x-client-ip');
        const userAgent = metaStr(md, 'x-client-ua');
        if (clientIp || userAgent) {
            data._meta = { ...(data._meta ?? {}), clientIp, userAgent };
        }

        return next.handle();
    }
}
