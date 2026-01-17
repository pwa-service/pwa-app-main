import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, OnModuleInit } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Metadata, status } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

interface AuthGrpcService {
    validateToken(data: { token: string }): Observable<UserRecord>;
}

export interface UserRecord {
    id: string;
    email?: string;
    username?: string;
}

@Injectable()
export class GrpcAuthInterceptor implements NestInterceptor, OnModuleInit {
    private authService!: AuthGrpcService;

    constructor(
        private readonly reflector: Reflector,
        @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
    ) {}

    onModuleInit() {
        this.authService = this.client.getService<AuthGrpcService>('AuthService');
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const handler = context.getHandler();
        const handlerName = handler.name;
        const className = context.getClass().name;

        const isSystemMethod = ['check', 'watch', 'list', 'serverReflectionInfo', 'index'].includes(handlerName);
        const isSystemClass = className === 'PrometheusController';

        if (isSystemMethod || isSystemClass) {
            return next.handle();
        }

        const allowAnon = this.reflector.get<boolean>('ALLOW_ANON', handler) ||
            this.reflector.get<boolean>('ALLOW_ANON', context.getClass());

        if (allowAnon) return next.handle();

        const rpc = context.switchToRpc();
        const metadata = context.getArgByIndex(1) as Metadata | undefined;
        const data = rpc.getData() as any;

        const authHeader = (metadata?.get('authorization')?.[0] as string | undefined) ?? '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();

        if (!token) {
            return throwError(() => new RpcException({ code: status.UNAUTHENTICATED, message: 'Missing access token' }));
        }

        return this.authService.validateToken({ token }).pipe(
            map((user) => {
                data.user = user;
                return null;
            }),
            switchMap(() => next.handle()),
            catchError((err) => {
                if (err.code) {
                    return throwError(() => new RpcException({ code: err.code, message: err.details || err.message }));
                }
                return throwError(() => new RpcException({ code: status.INTERNAL, message: `Auth Service Error: ${err.message}` }));
            }),
        );
    }
}