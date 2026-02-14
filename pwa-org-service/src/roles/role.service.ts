import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RolePriority, SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import {
    AccessLevel,
    AssignRoleDto,
    CreateRoleDto,
    PaginationQueryDto,
    RoleFilterQueryDto,
    SCOPE_PRIORITY,
    ScopeType,
    UpdateRoleDto
} from "../../../pwa-shared/src";
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";

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
                    sharingAccess: AccessLevel.Manage,
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
            sharingAccess: dto.globalRules.sharingAccess ?? AccessLevel.None,
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

    async findOne(id: number, user: UserPayload) {
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

    async findByNameAndContext(name: string, scope: ScopeType, contextId: string) {
        return this.repo.findByNameAndContext(name, scope, contextId);
    }

    async findAll(pagination: PaginationQueryDto, filters: RoleFilterQueryDto, user: UserPayload) {
        const filtersWithScope = {
            ...filters,
            userScope: user.scope,
            userContextId: user.contextId
        };

        const result = await this.repo.findAll(pagination, filtersWithScope);

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

        const operatorLevel = SCOPE_PRIORITY[operatorScope] || 0;
        const targetRoleLevel = SCOPE_PRIORITY[targetRole.scope] || 0;

        if (targetRoleLevel > operatorLevel) {
            throw new ForbiddenException(
                `Insufficient privileges: ${operatorScope} scope cannot assign ${targetRole.scope} roles`
            );
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
            sharingAccess:  AccessLevel.None
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