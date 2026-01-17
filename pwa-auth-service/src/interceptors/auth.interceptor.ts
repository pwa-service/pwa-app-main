import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {JwtVerifierService} from "../../../pwa-shared/src/modules/auth/jwt-verifier.service";
import {Reflector} from "@nestjs/core";

@Injectable()
export class LocalAuthInterceptor implements NestInterceptor {
    constructor(
        private readonly jwtService: JwtVerifierService,
        private readonly reflector: Reflector
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.switchToRpc();
        const metadata = ctx.getContext() as Metadata;
        const data = ctx.getData();

        const handler = context.getHandler();
        const handlerName = handler.name;
        const className = context.getClass().name;

        const allowAnon = this.reflector.get<boolean>('ALLOW_ANON', handler) ||
            this.reflector.get<boolean>('ALLOW_ANON', context.getClass());

        if (allowAnon) return next.handle();

        const isSystemMethod = ['check', 'watch', 'list', 'serverReflectionInfo', 'index'].includes(handlerName);
        const isSystemClass = className === 'PrometheusController';

        if (isSystemMethod || isSystemClass) {
            return next.handle();
        }

        const authHeader = metadata.get('authorization')[0];
        if (!authHeader) {
            throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Missing access token' });
        }

        const token = typeof authHeader === 'string' ? authHeader.replace(/^Bearer\s+/i, '') : '';

        try {
            const payload = await this.jwtService.verify(token);
            data.user = {
                id: payload.sub,
                email: payload['email'],
                username: payload['username']
            };

        } catch (e) {
            throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid or expired token' });
        }

        return next.handle();
    }
}