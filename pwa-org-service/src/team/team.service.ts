import { Injectable, BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TeamRepository } from './team.repository';
import { RoleService } from '../roles/role.service';
import { Prisma } from '../../../pwa-prisma/src';
import {
    CreateTeamDto,
    UpdateTeamDto,
    AddMemberDto,
    RemoveMemberDto,
    AssignLeadDto,
    TeamFilterQueryDto,
    PaginationQueryDto,
    WorkingObjectType,
    ScopeType,
} from '../../../pwa-shared/src';
import { SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";


@Injectable()
export class TeamService {
    constructor(
        private readonly repo: TeamRepository,
        private readonly roleService: RoleService,
    ) { }

    async create(dto: CreateTeamDto) {

        const team = await this.repo.createTeamTransaction(
            {
                name: dto.name,
                campaignId: dto.campaignId,
            },
            {
                type: WorkingObjectType.TEAM,
                status: 'active',
            }
        );

        if (dto.leadId) {
            const role = await this.roleService.findByNameAndContext(
                SystemRoleName.TEAM_LEAD, ScopeType.CAMPAIGN, dto.campaignId
            );
            if (!role) throw new BadRequestException('Role Team Lead not found');

            await this.addMemberToTeam({
                teamId: team.id,
                userId: dto.leadId,
                roleId: role.id,
            });
            await this.assignTeamLead({
                teamId: team.id,
                userId: dto.leadId,
            });
        }

        const full = await this.repo.findById(team.id);
        return this.mapToResponse(full);
    }

    async findOne(id: string) {
        const team = await this.repo.findById(id);
        if (!team) throw new RpcException({ code: 5, message: 'Team not found' });
        return this.mapToResponse(team);
    }

    async update(dto: UpdateTeamDto) {
        const team = await this.repo.findById(dto.id);
        if (!team) throw new RpcException({ code: 5, message: 'Team not found' });

        const updated = await this.repo.update(dto.id, {
            name: dto.name,
            teamLeadId: dto.leadId
        });

        return this.mapToResponse(updated);
    }

    async delete(id: string) {
        const team = await this.repo.findById(id);
        if (!team) throw new RpcException({ code: 5, message: 'Team not found' });

        await this.repo.delete(id, team.campaignId);
        return {};
    }

    async findAll(
        pagination: PaginationQueryDto,
        filters: TeamFilterQueryDto,
        user: UserPayload
    ) {
        const where: Prisma.TeamWhereInput = {};

        if (user.scope === ScopeType.CAMPAIGN) {
            where.campaignId = user.contextId;
        }
        else if (user.scope === ScopeType.TEAM) {
            where.id = user.contextId;
        }
        else if (user.scope === ScopeType.SYSTEM) {
            if (filters.campaignId) {
                where.campaignId = filters.campaignId;
            }
        }

        if (filters.search) {
            where.name = {
                contains: filters.search,
                mode: 'insensitive'
            };
        }

        if (filters.leadId) {
            where.teamLeadId = filters.leadId;
        }

        const { items, total } = await this.repo.findAll(pagination, where);

        return {
            teams: items.map((t) => this.mapToResponse(t)),
            total,
        };
    }

    async addMemberToTeam(dto: AddMemberDto) {
        const existing = await this.repo.findMember(dto.teamId, dto.userId);
        if (existing) throw new RpcException({ code: 6, message: 'User already in a team' });

        const member = await this.repo.addMember({
            teamId: dto.teamId,
            userProfileId: dto.userId,
            roleId: dto.roleId
        });

        return {
            id: member.userProfileId,
            user_id: member.userProfileId,
            team_id: member.teamId
        };
    }

    async removeMember(dto: RemoveMemberDto) {
        const member = await this.repo.findMember(dto.teamId, dto.userId);
        if (!member) throw new RpcException({ code: 5, message: 'Member not found in this team' });

        await this.repo.removeMember(dto.userId);
        return {};
    }

    async assignTeamLead(dto: AssignLeadDto) {
        const team = await this.repo.findById(dto.teamId);
        if (!team) throw new RpcException({ code: 5, message: 'Team not found' });

        const newLead = await this.repo.findMember(dto.teamId, dto.userId);
        if (!newLead) throw new RpcException({ code: 9, message: 'User must be a member of the team to become a lead' });

        const teamLeadRole = await this.roleService.findByNameAndContext(
            SystemRoleName.TEAM_LEAD, ScopeType.CAMPAIGN, team.campaignId
        );
        if (!teamLeadRole) throw new BadRequestException('Role Team Lead not found');

        const mediaBuyerRole = await this.roleService.findByNameAndContext(
            SystemRoleName.MEDIA_BUYER, ScopeType.CAMPAIGN, team.campaignId
        );
        if (!mediaBuyerRole) throw new BadRequestException('Role Media Buyer not found');

        // If there's an existing lead, demote them to MEDIA_BUYER
        if (team.teamLeadId && team.teamLeadId !== newLead.id) {
            const oldLead = team.teamLead;
            if (oldLead) {
                await this.roleService.updateMemberRole(oldLead.userProfileId, mediaBuyerRole.id);
                try {
                    await this.roleService.updateCampaignMemberRole(oldLead.userProfileId, mediaBuyerRole.id);
                } catch { /* ignore if not a campaign member */ }
            }
        }

        // Promote new lead to TEAM_LEAD role
        await this.roleService.updateMemberRole(dto.userId, teamLeadRole.id);
        try {
            await this.roleService.updateCampaignMemberRole(dto.userId, teamLeadRole.id);
        } catch { /* ignore if not a campaign member */ }

        // Update team's teamLeadId
        const updated = await this.repo.update(dto.teamId, {
            teamLeadId: newLead.id
        });

        return this.mapToResponse(updated);
    }

    private mapToResponse(team: any) {
        return {
            id: team.id,
            name: team.name,
            campaignId: team.campaignId,
            leadId: team.teamLead?.userProfileId || team.teamLeadId || null,
            createdAt: team.createdAt?.toISOString(),
            members: team.members ? team.members.map((m: any) => ({
                id: m.profile.id,
                email: m.profile.email,
                role: m.role?.name,
                scope: m.profile.scope,
                teamId: m.teamId,
                campaignId: team.campaignId,
                username: m.profile.username,
            })) : []
        };
    }
}