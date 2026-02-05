import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { CHECK_ALLOWED_SCOPES_KEY } from '../decorators/check-scope.decorator';
import { ScopeType } from '../../types/org/roles/enums/scope.enum';


@Injectable()
export class ScopeInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const allowedScopes = this.reflector.get<ScopeType[]>(
            CHECK_ALLOWED_SCOPES_KEY,
            context.getHandler(),
        );

        if (!allowedScopes || allowedScopes.length === 0) {
            return next.handle();
        }

        const rpcContext = context.switchToRpc();
        const user = rpcContext.getContext().user || rpcContext.getData().user;

        if (!user || !user.scope) {
            throw new RpcException({ code: 16, message: 'User context missing or unauthenticated' });
        }

        const hasScope = allowedScopes.includes(user.scope as ScopeType);
        if (!hasScope) {
            throw new RpcException({
                code: 7,
                message: `Access denied. Required scopes: [${allowedScopes.join(', ')}]. You have: ${user.scope}`
            });
        }

        return next.handle();
    }
}