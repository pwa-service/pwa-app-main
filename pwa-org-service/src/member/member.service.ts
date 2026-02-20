import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
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
            userContextId: user.contextId
        };

        const { items, total } = await this.repo.findAll(pagination, filtersWithScope);
        const members = items.map((item: any) => ({
            id: item.userProfileId,
            userId: item.userProfileId,
            email: item.profile?.email,
            username: item.profile?.username,
            role: item.role?.name,
            scope: item.profile.scope,
            teamId: item.teamId || null,
            campaignId: item.campaignId || (item.team ? item.team.campaignId : null)
        }));

        return { members, total };
    }

    async createTeamLead(dto: CreateTeamMemberDto, user: UserPayload) {
        const role = await this.roleService.findByNameAndContext(SystemRoleName.TEAM_LEAD, ScopeType.CAMPAIGN, dto.campaignId!);
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
        });
        await this.teamService.assignTeamLead({
            userId: authUser.id,
            teamId: dto.teamId!
        });
        return this.formatResponse({
            ...member,
            scope: ScopeType.TEAM,
            team_id: dto.teamId,
            role: role.name,
            email: dto.email,
            username: user.username,
        });
    }

    async createTeamMember(dto: CreateTeamMemberDto, user: UserPayload) {
        const roleName = SystemRoleName.MEDIA_BUYER;
        const role = await this.roleService.findByNameAndContext(roleName, ScopeType.CAMPAIGN, dto.campaignId!);
        if (!role) throw new BadRequestException('Role not found');

        const { user: authUser } = await this.callAuthService({
            ...dto,
            scope: ScopeType.TEAM,
        });
        const member = await this.teamService.addMemberToTeam({
            userId: authUser.id,
            teamId: dto.teamId!,
            roleId: role.id
        });

        return this.formatResponse({
            ...member,
            scope: ScopeType.TEAM,
            team_id: dto.teamId,
            role: role.name,
            email: dto.email,
            username: user.username,
        });
    }

    async createCampaignMember(dto: CreateCampaignMemberDto, user: UserPayload) {
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
            email: dto.email,
            username: user.username,
        });
    }

    async deleteUser(userId: string) {
        await this.repo.deleteUser(userId);
        return {};
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
            email: member.email,
            scope: member.scope!,
            username: member.username!,
        };
    }
}