import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Metadata, status } from '@grpc/grpc-js';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { JwtVerifierService } from '../jwt-verifier.service';
import {RefreshStore} from "../common/refresh.store";

export interface UserRecord {
    id: string;
    email?: string | null;
    username?: string | null;
}

export interface UserLookupPort {
    findById(id: string): Promise<UserRecord | null>;
}

export const USER_LOOKUP_PORT = 'USER_LOOKUP_PORT';

@Injectable()
export class GrpcAuthInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwt: JwtVerifierService,
        private readonly store: RefreshStore,
        @Inject(USER_LOOKUP_PORT) private readonly users: UserLookupPort,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const allowAnon = this.reflector.get<boolean>('ALLOW_ANON', context.getHandler()) ||
            this.reflector.get<boolean>('ALLOW_ANON', context.getClass());
        const rpc = context.switchToRpc();
        const metadata = context.getArgByIndex(1) as Metadata | undefined;
        const data = rpc.getData() as any;

        const authHeader = (metadata?.get('authorization')?.[0] as string | undefined) ?? '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();

        if (!token) {
            if (allowAnon) return next.handle();
            return throwError(() => new RpcException({ code: status.UNAUTHENTICATED, message: 'Missing access token' }));
        }
        return from(this.jwt.verify(token)).pipe(
            switchMap(async (payload) => {
                const sub = String(payload.sub ?? '');
                if (!sub) {
                    await this.store.revoke(String(sub))
                    throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid token: no subject' });
                }

                const user = await this.users.findById(sub);
                if (!user && !allowAnon) {
                    throw new RpcException({ code: status.PERMISSION_DENIED, message: 'User not found' });
                }
                data.user = user ?? { id: sub, email: payload['email'] as string | undefined, username: payload['username'] as string | undefined };
                return null;
            }),
            switchMap(() => next.handle()),
            catchError((err) => {
                if (err instanceof RpcException) return throwError(() => err);
                return throwError(() => new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid/expired token' }));
            }),
        );
    }
}