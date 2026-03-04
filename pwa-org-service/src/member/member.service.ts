import { BadRequestException, ForbiddenException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { RolePriority } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { firstValueFrom, Observable } from 'rxjs';
import {
    CreateCampaignMemberDto,
    CreateTeamMemberDto,
    MemberFilterQueryDto,
    PaginationQueryDto,
    ScopeType
} from '../../../pwa-shared/src';
import { RoleService } from '../roles/role.service';
import { TeamService } from '../team/team.service';
import { CampaignService } from '../campaign/campaign.service';
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import { MemberRepository } from "./member.repository";
import { SignUpOrgDto } from "../../../pwa-shared/src/types/auth/dto/sing-up-org.dto";

interface AuthServiceGrpc {
    OrgSignUp(data: SignUpOrgDto): Observable<{ id: string, email: string, user: UserPayload }>;
    UpdateCreds(data: { userId: string; email?: string; password?: string }): Observable<{ userId: string; email: string }>;
    DeleteUser(data: { userId: string }): Observable<{}>;
}

@Injectable()
export class MemberService implements OnModuleInit {
    private authService: AuthServiceGrpc;

    constructor(
        private readonly memberRepo: MemberRepository,
        private readonly roleService: RoleService,
        private readonly teamService: TeamService,
        private readonly campaignService: CampaignService,
        @Inject('AUTH_PACKAGE') private authClient: ClientGrpc,
    ) { }

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceGrpc>('AuthService');
    }

    async findAll(pagination: PaginationQueryDto, filters: MemberFilterQueryDto, user: UserPayload) {
        const filtersWithScope = {
            ...filters,
            userScope: user.scope,
            userContextId: user.contextId,
            excludeUserId: user.id
        };

        const { items, total } = await this.memberRepo.findAll(pagination, filtersWithScope);

        const members = items.map((profile: any) => {
            const isTeamUser = !!profile.teamUser;
            const contextSource = isTeamUser ? profile.teamUser : profile.campaignUser;

            return {
                id: profile.id,
                userId: profile.id,
                email: profile.email,
                username: profile.username,
                role: contextSource?.role?.name || 'N/A',
                roleId: contextSource?.roleId,
                scope: profile.scope,
                teamId: profile.teamUser?.teamId || null,
                teamName: profile.teamUser?.team?.name || null,
                campaignId: profile.campaignUser?.campaignId || profile.teamUser?.team?.campaignId || null,
                campaignName: profile.campaignUser?.campaign?.name || null
            };
        });

        return { members, total };
    }

    async createTeamLead(dto: CreateTeamMemberDto, user: UserPayload) {
        const role = await this.roleService.findByPriorityAndContext(RolePriority.LEAD, ScopeType.CAMPAIGN, dto.campaignId!);
        if (!role) throw new BadRequestException('Role Team Lead not found');

        const { user: authUser } = await this.callAuthService({
            ...dto,
            scope: ScopeType.TEAM,
        });

        try {
            const member = await this.teamService.addMemberToTeam({
                ...dto,
                userId: authUser.id,
                roleId: role.id,
                teamId: dto.teamId!,
            }, user);
            await this.campaignService.upsertMember(authUser.id, dto.campaignId!, role.id);
            await this.teamService.assignTeamLead({
                userId: authUser.id,
                teamId: dto.teamId!
            }, user);
            return this.formatResponse({
                ...member,
                scope: ScopeType.TEAM,
                team_id: dto.teamId,
                role: role.name,
                roleId: role.id,
                email: dto.email,
                username: user.username,
            });
        } catch (e) {
            await this.rollbackAuthUser(authUser.id);
            throw e;
        }
    }

    async createTeamMember(dto: CreateTeamMemberDto, user: UserPayload) {
        const role = await this.roleService.findByPriorityAndContext(
            RolePriority.MEMBER,
            ScopeType.CAMPAIGN,
            dto.campaignId!
        );
        if (!role) throw new BadRequestException('Media Buyer role not found in this campaign');

        const { user: authUser } = await this.callAuthService({
            ...dto,
            scope: ScopeType.TEAM,
        });

        try {
            const member = await this.teamService.addMemberToTeam({
                userId: authUser.id,
                teamId: dto.teamId!,
                roleId: role.id
            }, user);

            await this.campaignService.upsertMember(authUser.id, dto.campaignId!, role.id);
            await this.memberRepo.removeCampaignUser(authUser.id);

            return this.formatResponse({
                ...member,
                scope: ScopeType.TEAM,
                team_id: dto.teamId,
                role: role.name,
                roleId: role.id,
                email: dto.email,
                username: authUser.username,
            });
        } catch (e) {
            await this.rollbackAuthUser(authUser.id);
            throw e;
        }
    }

    async createCampaignMember(dto: CreateCampaignMemberDto, user: UserPayload) {
        dto.campaignId = user.scope == ScopeType.SYSTEM ? dto.campaignId : user.contextId;

        if (user.scope !== ScopeType.SYSTEM && dto.roleId && dto.campaignId) {
            const actorPriority = await this.memberRepo.getActorCampaignRolePriority(user.id, dto.campaignId);
            const targetPriority = await this.memberRepo.getRolePriorityById(parseInt(dto.roleId));
            if (targetPriority < actorPriority) {
                throw new ForbiddenException('Cannot assign a role with higher privilege than your own');
            }
        }

        const { user: authUser } = await this.callAuthService({
            ...dto,
            scope: ScopeType.CAMPAIGN,
        });

        try {
            const member = await this.campaignService.addMember(authUser.id, dto.campaignId!, parseInt(dto.roleId!));
            return this.formatResponse({
                ...member,
                user_id: user.id,
                scope: ScopeType.CAMPAIGN,
                role: dto.roleId,
                roleId: dto.roleId,
                email: dto.email,
                username: user.username,
            });
        } catch (e) {
            await this.rollbackAuthUser(authUser.id);
            throw e;
        }
    }

    async deleteUser(userId: string, user: UserPayload) {
        if (userId === user.id) {
            throw new BadRequestException('You cannot delete your own account');
        }
        await this.memberRepo.deleteUser(userId);
        return {};
    }

    async updateUser(dto: { id: string, email?: string, password?: string }, user: UserPayload) {
        const result = await firstValueFrom(
            this.authService.UpdateCreds({
                userId: dto.id,
                email: dto.email,
                password: dto.password,
            })
        );

        return this.formatResponse({
            user_id: result.userId,
            email: result.email,
            username: user.username,
            scope: user.scope,
            role: 'updated',
        });
    }

    private async callAuthService(dto: any) {
        try {
            return await firstValueFrom(this.authService.OrgSignUp(dto));
        } catch (e) {
            throw new RpcException(`Auth failed: ${e}`);
        }
    }

    private async rollbackAuthUser(userId: string): Promise<void> {
        try {
            await firstValueFrom(this.authService.DeleteUser({ userId }));
        } catch (e) {
            throw new RpcException(`Rollback failed: ${e}`);
        }
    }

    private formatResponse(member: any) {
        return {
            id: member.user_id,
            teamId: member.team_id,
            role: member.role,
            roleId: member.roleId,
            email: member.email,
            scope: member.scope!,
            username: member.username!,
        };
    }
}