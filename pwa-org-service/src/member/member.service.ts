import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
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
}

@Injectable()
export class MemberService implements OnModuleInit {
    private authService: AuthServiceGrpc;

    constructor(
        private readonly repo: MemberRepository,
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

        const { items, total } = await this.repo.findAll(pagination, filtersWithScope);

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
        const member = await this.teamService.addMemberToTeam({
            ...dto,
            userId: authUser.id,
            roleId: role.id,
            teamId: dto.teamId!,
        }, user);
        // Ensure campaign membership exists to avoid duplication in member list
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
    }

    async createTeamMember(dto: CreateTeamMemberDto, user: UserPayload) {
        const role = await this.roleService.findByPriorityAndContext(RolePriority.MEMBER, ScopeType.CAMPAIGN, dto.campaignId!);
        if (!role) throw new BadRequestException('Role not found');

        const { user: authUser } = await this.callAuthService({
            ...dto,
            scope: ScopeType.TEAM,
        });
        const member = await this.teamService.addMemberToTeam({
            userId: authUser.id,
            teamId: dto.teamId!,
            roleId: role.id
        }, user);
        // Ensure campaign membership exists to avoid duplication in member list
        await this.campaignService.upsertMember(authUser.id, dto.campaignId!, role.id);

        return this.formatResponse({
            ...member,
            scope: ScopeType.TEAM,
            team_id: dto.teamId,
            role: role.name,
            roleId: role.id,
            email: dto.email,
            username: user.username,
        });
    }

    async createCampaignMember(dto: CreateCampaignMemberDto, user: UserPayload) {
        dto.campaignId = user.scope == ScopeType.SYSTEM ? dto.campaignId : user.contextId
        const { user: authUser } = await this.callAuthService({
            ...dto,
            scope: ScopeType.CAMPAIGN,
        });
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
    }

    async deleteUser(userId: string, user: UserPayload) {
        if (userId === user.id) {
            throw new BadRequestException('You cannot delete your own account');
        }
        await this.repo.deleteUser(userId);
        return {};
    }

    async updateUser(dto: { id: string, email?: string, password?: string }, user: UserPayload) {
        const updateData: any = {};
        if (dto.email) {
            updateData.email = dto.email;
        }
        if (dto.password) {
            updateData.passwordHash = await bcrypt.hash(dto.password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException('No fields to update');
        }

        const updatedUser = await this.repo.updateUser(dto.id, updateData);

        return this.formatResponse({
            user_id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            scope: updatedUser.scope,
            role: 'updated',
        });
    }

    private async callAuthService(dto: any) {
        try {
            return await firstValueFrom(this.authService.OrgSignUp(dto));
        } catch (e) {
            throw new BadRequestException(`Auth failed: ${e}`);
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