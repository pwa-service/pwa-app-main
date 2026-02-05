import {
    Injectable,
    OnModuleInit,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
    Logger
} from '@nestjs/common';
import { AccessLevel } from '../../../pwa-shared/src/types/org/sharing/enums/access.enum';
import { RoleRepository } from './role.repository';
import { RolePriority, SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { PaginationQueryDto } from "../../../pwa-shared/src";
import { RoleFilterQueryDto } from "../../../pwa-shared/src/types/org/roles/dto/filters-query.dto";
import { CreateRoleDto } from "../../../pwa-shared/src/types/org/roles/dto/create-role.dto";
import { UpdateRoleDto } from "../../../pwa-shared/src/types/org/roles/dto/update-role.dto";
import { AssignRoleDto } from "../../../pwa-shared/src/types/org/roles/dto/assign-role.dto";
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import { ScopeType } from '../../../pwa-shared/src/types/org/roles/enums/scope.enum';

@Injectable()
export class RoleService implements OnModuleInit {
    private readonly logger = new Logger(RoleService.name);

    constructor(private repo: RoleRepository) {}

    async onModuleInit() {
        const rootRole = await this.repo.findByNameAndContext(SystemRoleName.PRODUCT_OWNER, ScopeType.SYSTEM);
        if (!rootRole) {
            this.logger.log(`Initializing Root Role: ${SystemRoleName.PRODUCT_OWNER}`);
            await this.repo.create(
                {
                    name: SystemRoleName.PRODUCT_OWNER,
                    priority: RolePriority.ROOT,
                    description: 'Super Admin of the entire platform',
                    scope: ScopeType.SYSTEM,
                },
                `auto_gen_root_${Date.now()}`,
                {
                    statAccess: AccessLevel.Manage,
                    finAccess: AccessLevel.Manage,
                    logAccess: AccessLevel.Manage,
                    usersAccess: AccessLevel.Manage,
                    sharingAccess: true,
                }
            );
        }
    }

    async create(dto: CreateRoleDto, userScope: ScopeType, contextId?: string) {
        const rulesData = {
            statAccess: dto.globalRules.statAccess ?? AccessLevel.None,
            finAccess: dto.globalRules.finAccess ?? AccessLevel.None,
            logAccess: dto.globalRules.logAccess ?? AccessLevel.None,
            usersAccess: dto.globalRules.usersAccess ?? AccessLevel.None,
            sharingAccess: dto.globalRules.sharingAccess ?? false,
        };

        const newPriority = RolePriority.MEMBER;
        const roleData: any = {
            name: dto.name,
            description: dto.description,
            priority: newPriority,
            scope: userScope
        };

        if (userScope === ScopeType.CAMPAIGN) {
            if (!contextId) throw new BadRequestException('Campaign ID required');
            roleData.campaignId = contextId;
        } else if (userScope === ScopeType.TEAM) {
            if (!contextId) throw new BadRequestException('Team ID required');
            roleData.teamId = contextId;
        }

        const exists = await this.repo.findByNameAndContext(dto.name, userScope, contextId);
        if (exists) throw new BadRequestException('Role with this name already exists in this context');

        const role = await this.repo.create(
            roleData,
            `auto_gen_${Date.now()}_${Math.random()}`,
            rulesData
        );

        return this.toRoleResponse(role);
    }

    async update(dto: UpdateRoleDto, scope: ScopeType) {
        const roleId = parseInt(dto.id);
        const role = await this.repo.findById(roleId);

        if (!role) throw new NotFoundException('Role not found');
        if (role.scope !== scope) throw new ForbiddenException('Cannot edit role from different scope');

        if (role.name === SystemRoleName.PRODUCT_OWNER) {
            throw new BadRequestException('Cannot edit Root System Role');
        }

        const rulesUpdateData = dto.globalRules ? {
            statAccess: dto.globalRules.statAccess,
            finAccess: dto.globalRules.finAccess,
            logAccess: dto.globalRules.logAccess,
            usersAccess: dto.globalRules.usersAccess,
            sharingAccess: dto.globalRules.sharingAccess,
        } : {};

        const updatedRole = await this.repo.update(
            roleId,
            { name: dto.name, description: dto.description },
            role.accessProfile!.accessProfileId,
            rulesUpdateData
        );

        return this.toRoleResponse(updatedRole);
    }

    async findOne(idStr: string, user: UserPayload) {
        const id = parseInt(idStr);
        const role = await this.repo.findById(id);

        if (!role) throw new NotFoundException('Role not found');

        if (user.scope !== ScopeType.SYSTEM) {
            if (role.scope === ScopeType.CAMPAIGN) {
                if (user.scope !== ScopeType.CAMPAIGN || user.contextId !== role.campaignId) {
                    throw new ForbiddenException('Access to this campaign role is denied');
                }
            }
            else if (role.scope === ScopeType.TEAM) {
                if (user.scope !== ScopeType.TEAM || user.contextId !== role.teamId) {
                    throw new ForbiddenException('Access to this team role is denied');
                }
            }
        }

        return this.toRoleResponse(role);
    }

    async findByName(name: string) {
        return this.repo.findByName(name);
    }

    async findAll(pagination: PaginationQueryDto, filters: RoleFilterQueryDto, user: UserPayload) {
        const effectiveFilters = { ...filters, scope: user.scope };

        if (user.scope === ScopeType.CAMPAIGN) {
            effectiveFilters.campaignId = user.contextId!;
        } else if (user.scope === ScopeType.TEAM) {
            effectiveFilters.teamId = user.contextId!;
        }

        const result = await this.repo.findAll(pagination, effectiveFilters);

        const mappedRoles = result.items.map((role: any) => this.toRoleResponse(role));

        return {
            roles: mappedRoles,
            total: result.total
        };
    }

    async assignRoleToUser(dto: AssignRoleDto, operatorScope: ScopeType) {
        const roleId = dto.roleId;
        const targetRole = await this.repo.findById(roleId);

        if (!targetRole) throw new NotFoundException('Role not found');

        if (targetRole.scope !== operatorScope) {
            throw new ForbiddenException("Cannot assign role from different scope");
        }

        let targetContextId: string | undefined;
        if (targetRole.scope === ScopeType.CAMPAIGN) targetContextId = targetRole.campaignId!;
        if (targetRole.scope === ScopeType.TEAM) targetContextId = targetRole.teamId!;

        await this.repo.assignUserToContext(
            dto.userId,
            roleId,
            targetRole.scope as ScopeType,
            targetContextId
        );

        return { status: "OK", userId: dto.userId, roleId };
    }

    async delete(idStr: string, scope: ScopeType): Promise<void> {
        const id = parseInt(idStr);
        const role = await this.repo.findById(id);

        if (!role) throw new NotFoundException('Role not found');
        if (role.scope !== scope) throw new ForbiddenException('Access denied');

        if (role.name === SystemRoleName.PRODUCT_OWNER) {
            throw new BadRequestException('Cannot delete System Role');
        }

        await this.repo.delete(id);
    }


    private toRoleResponse(role: any) {
        const globalRules = role.accessProfile?.accessProfile?.globalRules || {
            statAccess: AccessLevel.None,
            finAccess: AccessLevel.None,
            logAccess: AccessLevel.None,
            usersAccess: AccessLevel.None,
            sharingAccess: false
        };

        return {
            id: role.id.toString(),
            name: role.name,
            description: role.description || '',
            scope: role.scope,
            globalRules: {
                statAccess: globalRules.statAccess,
                finAccess: globalRules.finAccess,
                logAccess: globalRules.logAccess,
                usersAccess: globalRules.usersAccess,
                sharingAccess: globalRules.sharingAccess,
            },
            isSystem: role.scope === ScopeType.SYSTEM
        };
    }
}