import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NestInterceptor,
    NotFoundException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleRepository } from '../../roles/role.repository';
import { ScopeType } from '../../../../pwa-shared/src'
import { CHECK_ROLE_PRIORITY_KEY } from '../decorators/check-role-priority.decorator';

@Injectable()
export class RolePriorityInterceptor implements NestInterceptor {
    constructor(
        private readonly repo: RoleRepository,
        private readonly reflector: Reflector
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        if (context.getType() !== 'rpc') {
            return next.handle();
        }

        const rpcContext = context.switchToRpc();
        const data = rpcContext.getData();
        const user = data.user;

        if (!user) {
            return next.handle();
        }

        const fieldName = this.reflector.get<string>(
            CHECK_ROLE_PRIORITY_KEY,
            context.getHandler()
        );

        if (!fieldName) {
            return next.handle();
        }

        const roleIdRaw = data[fieldName];

        if (!roleIdRaw) {
            return next.handle();
        }

        const roleId = parseInt(roleIdRaw);

        const targetRole = await this.repo.findById(roleId);
        if (!targetRole) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }

        if (user.scope === ScopeType.SYSTEM && targetRole.scope !== ScopeType.SYSTEM) {
            return next.handle();
        }

        const userPriority = await this.repo.getUserPriority(user.id, user.scope, user.contextId);

        if (userPriority >= targetRole.priority) {
            throw new ForbiddenException(
                `Insufficient priority: Your priority (${userPriority}) cannot modify role with priority (${targetRole.priority})`
            );
        }

        return next.handle();
    }
}