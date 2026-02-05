import { Inject, Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { firstValueFrom, Observable } from 'rxjs';
import {CreateMemberDto, PaginationQueryDto, SignUpDto} from '../../../pwa-shared/src';
import { RoleService } from '../roles/role.service';
import { TeamService } from '../team/team.service';
import { CampaignService } from '../campaign/campaign.service';
import {CreateCampaignMemberDto} from "../../../pwa-shared/src/types/org/member/dto/create-campaign.dto";
import {MemberFilterQueryDto} from "../../../pwa-shared/src/types/org/member/dto/filter-query.dto";
import {ScopeType} from "../../../pwa-shared/src/types/org/roles/enums/scope.enum";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {MemberRepository} from "./member.repository";


interface AuthServiceGrpc {
    OrgSignUp(data: SignUpDto): Observable<{ id: string, email: string }>;
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

    async findAll(pagination: PaginationQueryDto, filters: MemberFilterQueryDto, actor: UserPayload) {
        const where = { ...filters };

        if (actor.scope === ScopeType.CAMPAIGN) {
            where.campaignId = actor.contextId;
        }
        else if (actor.scope === ScopeType.TEAM) {
            where.teamId = actor.contextId;
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

    async createTeamLead(dto: CreateMemberDto) {
        const role = await this.roleService.findByName(SystemRoleName.TEAM_LEAD);
        if (!role) throw new BadRequestException('Role Team Lead not found');

        const authUser = await this.callAuthService(dto);
        const member = await this.teamService.addMemberToTeam({
            ...dto,
            userId: authUser.id,
            roleId: role.id,
            teamId: dto.teamId!
        });
        await this.teamService.assignTeamLead({
            ...dto,
            userId: authUser.id,
            teamId: dto.teamId!
        });
        return this.formatResponse(member, dto.email);
    }

    async createTeamMember(dto: CreateMemberDto) {
        const roleName = SystemRoleName.MEDIA_BUYER; // Або інша дефолтна роль

        const roleId = dto.roleId
            ? dto.roleId
            : (await this.roleService.findByName(roleName))?.id;

        if (!roleId) throw new BadRequestException('Role not found');

        const authUser = await this.callAuthService(dto);
        const member = await this.teamService.addMemberToTeam({
            userId:authUser.id,
            teamId: dto.teamId!,
            roleId
        });

        return this.formatResponse(member, dto.email);
    }

    async createCampaignMember(dto: CreateCampaignMemberDto) {
        const roleId = dto.roleId
            ? dto.roleId
            : (await this.roleService.findByName(SystemRoleName.MEDIA_BUYER))?.id;

        if (!roleId) throw new BadRequestException('Role not found');

        const authUser = await this.callAuthService(dto);
        const member = await this.campaignService.addMember(authUser.id, dto.campaignId, roleId);

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
            return await firstValueFrom(this.authService.OrgSignUp({
                email: dto.email,
                password: dto.password,
                username: dto.username
            }));
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