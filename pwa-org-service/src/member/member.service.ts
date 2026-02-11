import { Inject, Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { firstValueFrom, Observable } from 'rxjs';
import {CreateCampaignMemberDto, PaginationQueryDto, SignUpDto} from '../../../pwa-shared/src';
import { RoleService } from '../roles/role.service';
import { TeamService } from '../team/team.service';
import { CampaignService } from '../campaign/campaign.service';
import {ScopeType, MemberFilterQueryDto} from "../../../pwa-shared/src";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {MemberRepository} from "./member.repository";
import {SignUpOrgDto} from "../../../pwa-shared/src/types/auth/dto/sing-up-org.dto";


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
    ) {}

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceGrpc>('AuthService');
    }

    async findAll(pagination: PaginationQueryDto, filters: MemberFilterQueryDto, user: UserPayload) {
        const where = { ...filters };

        if (user.scope === ScopeType.CAMPAIGN) {
            where.campaignId = user.contextId;
        }
        else if (user.scope === ScopeType.TEAM) {
            where.teamId = user.contextId;
            where.campaignId = undefined;
        }

        const { items, total } = await this.repo.findAll(pagination, where);
        const members = items.map((item: any) => ({
            id: item.id.toString(),
            userId: item.userProfileId,
            email: item.profile?.email || '',
            username: item.profile?.username || '',
            role: item.role?.name || 'Unknown',
            teamId: item.teamId || null,
            campaignId: item.campaignId || null
        }));

        return { members, total };
    }

    async createTeamLead(dto: CreateCampaignMemberDto, user: UserPayload) {
        const role = await this.roleService.findByNameAndContext(SystemRoleName.TEAM_LEAD, user.scope, user.contextId!);
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
        return this.formatResponse(member, dto.email);
    }

    async createTeamMember(dto: CreateCampaignMemberDto, user: UserPayload) {
        const roleName = SystemRoleName.MEDIA_BUYER;
        const role = await this.roleService.findByNameAndContext(roleName, user.scope, user.contextId!);
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

        return this.formatResponse(member, dto.email);
    }

    async createCampaignMember(dto: CreateCampaignMemberDto, user: UserPayload) {
        const role = await this.roleService.findByNameAndContext(SystemRoleName.CAMPAIGN_MEMBER, user.scope, user.contextId!);
        if (!role) throw new BadRequestException('Role not found');

        const { user: authUser } = await this.callAuthService(dto);
        const member = await this.campaignService.addMember(authUser.id, dto.campaignId!, role.id);

        return {
            status: 'success',
            userId: member.userProfileId,
            campaignId: member.campaignId,
            role: member.role.name,
            email: dto.email
        };
    }

    private async callAuthService(dto: any) {
        try {
            return await firstValueFrom(this.authService.OrgSignUp(dto));
        } catch (e) {
            throw new BadRequestException(`Auth failed: ${e}`);
        }
    }

    private formatResponse(member: any, email: string) {
        return {
            status: 'success',
            userId: member.userProfileId,
            teamId: member.teamId,
            role: member.role?.name,
            credentials: { email, message: 'Created' }
        };
    }
}