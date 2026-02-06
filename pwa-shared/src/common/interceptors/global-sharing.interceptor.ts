import { Injectable, ExecutionContext, CallHandler, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GLOBAL_ACCESS_KEY } from '../decorators/access.decorators';
import {AccessLevel, AccessLevelWeight, ResourceType} from '../../types/org/sharing/enums/access.enum';
import { UserPayload } from '../../types/auth/dto/user-payload.dto';

@Injectable()
export class GlobalSharingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(GlobalSharingInterceptor.name);

    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== 'rpc') return next.handle();

        const handler = context.getHandler();
        const metadata = this.reflector.get(GLOBAL_ACCESS_KEY, handler);

        if (!metadata) return next.handle();

        const { resource, level } = metadata;
        const ctx = context.switchToRpc();
        const data = ctx.getData();
        const user: UserPayload = ctx.getContext().user || data.user;

        if (!user || !user.access) {
            return throwError(() => new RpcException({ code: status.UNAUTHENTICATED, message: 'User access profile missing' }));
        }

        if (resource === ResourceType.SHARING && user.access.sharingAccess !== AccessLevel.Manage) {
            return throwError(() => new RpcException({ code: status.PERMISSION_DENIED, message: 'Sharing access denied' }));
        }

        const accessKey = `${resource.toLowerCase()}Access`;
        const userLevel = user.access[accessKey as keyof typeof user.access];

        if (!userLevel) {
            return throwError(() => new RpcException({ code: status.PERMISSION_DENIED, message: `Access to ${resource} is not defined for this role` }));
        }


        const userWeight = AccessLevelWeight[userLevel as keyof typeof AccessLevelWeight];
        const requiredWeight = AccessLevelWeight[level as keyof typeof AccessLevelWeight];

        if (userWeight === undefined || requiredWeight === undefined) {
            return throwError(() => new RpcException({
                code: status.INTERNAL,
                message: `Invalid access level configuration. User: ${userLevel}, Required: ${level}`
            }));
        }

        if (userWeight < requiredWeight) {
            return throwError(() => new RpcException({
                code: status.PERMISSION_DENIED,
                message: `Insufficient permissions for ${resource}. Required: ${level}, Actual: ${userLevel}`
            }));
        }

        return next.handle();
    }
}