import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TeamRepository } from './team.repository';
import { RoleService } from '../roles/role.service';
import { Prisma } from '../../../pwa-prisma/src';
import {
    AddMemberDto,
    AssignLeadDto,
    CreateTeamDto,
    PaginationQueryDto,
    RemoveMemberDto,
    ScopeType,
    TeamFilterQueryDto,
    UpdateTeamDto,
    WorkingObjectType,
} from '../../../pwa-shared/src';
import { RolePriority } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";


@Injectable()
export class TeamService {
    constructor(
        private readonly repo: TeamRepository,
        private readonly roleService: RoleService,
    ) { }

    async create(dto: CreateTeamDto, user: UserPayload) {
        const team = await this.repo.createTeamTransaction(
            {
                name: dto.name,
                campaignId: dto.campaignId!,
            },
            {
                type: WorkingObjectType.TEAM,
                status: 'active',
            }
        );

        let teamLeadId: string | null = null;
        if (dto.leadId) {
            const role = await this.roleService.findByPriorityAndContext(
                RolePriority.LEAD, ScopeType.CAMPAIGN, dto.campaignId
            );
            if (!role) throw new BadRequestException('Role Team Lead not found');

            await this.addMemberToTeam({
                teamId: team.id,
                userId: dto.leadId,
                roleId: role.id,
            }, user);

            teamLeadId = await this.assignTeamLead({
                teamId: team.id,
                userId: dto.leadId,
            }, user);

            await this.repo.update(team.id, {
                teamLeadId
            });
        }

        const full = await this.repo.findById(team.id);
        return this.mapToResponse(full);
    }

    async findOne(id: string, user: UserPayload) {
        const team = await this.repo.findById(id);
        if (!team) throw new RpcException({ code: 5, message: 'Team not found' });

        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== team.campaignId) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }
        if (user.scope === ScopeType.TEAM && user.contextId !== team.id) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }

        return this.mapToResponse(team);
    }

    async update(dto: UpdateTeamDto, user: UserPayload) {
        const team = await this.repo.findById(dto.id);
        if (!team) throw new RpcException({ code: 5, message: 'Team not found' });

        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== team.campaignId) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }
        if (user.scope === ScopeType.TEAM && user.contextId !== team.id) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }

        const currentLeadId = team.teamLead?.userProfileId;

        let newTeamLeadId = team.teamLeadId;

        if (dto.leadId && dto.leadId !== currentLeadId) {
            newTeamLeadId = await this.assignTeamLead({
                teamId: dto.id,
                userId: dto.leadId
            }, user);
        }

        const updateData: any = {};
        if (dto.name && dto.name.trim() !== '') {
            updateData.name = dto.name;
        }
        if (newTeamLeadId !== undefined) {
            updateData.teamLeadId = newTeamLeadId;
        }

        await this.repo.update(dto.id, updateData);

        const fullTeam = await this.repo.findById(dto.id);
        return this.mapToResponse(fullTeam);
    }

    async delete(id: string, user: UserPayload) {
        const team = await this.repo.findById(id);
        if (!team) throw new RpcException({ code: 5, message: 'Team not found' });

        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== team.campaignId) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }
        if (user.scope === ScopeType.TEAM && user.contextId !== team.id) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }

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

    async addMemberToTeam(dto: AddMemberDto, user: UserPayload) {
        const team = await this.repo.findById(dto.teamId);
        if (!team) throw new BadRequestException('Team not found');

        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== team.campaignId) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }
        if (user.scope === ScopeType.TEAM && user.contextId !== team.id) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }

        const existing = await this.repo.findMember(dto.teamId, dto.userId);
        if (existing) throw new BadRequestException('User already in a team');

        let roleId = dto.roleId;
        if (!roleId) {
            const role = await this.roleService.findByPriorityAndContext(
                RolePriority.MEMBER, ScopeType.CAMPAIGN, team.campaignId
            );
            if (!role) throw new BadRequestException('Default Media Buyer role not found');
            roleId = role.id;
        }

        const member = await this.repo.addMember({
            teamId: dto.teamId,
            userProfileId: dto.userId,
            roleId: roleId
        }, user.scope);

        return {
            id: member.userProfileId,
            scope: user.scope,
            email: user.email,
            username: user.username,
        };
    }

    async removeMember(dto: RemoveMemberDto, user: UserPayload) {
        const team = await this.repo.findById(dto.teamId);
        if (!team) throw new BadRequestException('Team not found');

        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== team.campaignId) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }
        if (user.scope === ScopeType.TEAM && user.contextId !== team.id) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }

        const member = await this.repo.findMember(dto.teamId, dto.userId);
        if (!member) throw new BadRequestException('Member not found in this team');

        if (team.teamLeadId === member.id) {
            await this.repo.update(dto.teamId, { teamLeadId: null });
        }

        await this.repo.removeMember(dto.userId);
        return {};
    }

    async assignTeamLead(dto: AssignLeadDto, user: UserPayload, isCreation: boolean = false) {
        const team = await this.repo.findById(dto.teamId);
        if (!team) throw new RpcException({ code: 5, message: 'Team not found' });

        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== team.campaignId) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }
        if (user.scope === ScopeType.TEAM && user.contextId !== team.id) {
            throw new RpcException({ code: 5, message: 'Access to this team is denied' });
        }

        const hasAlreadyLead = await this.repo.hasLead(dto.teamId);
        if (isCreation && hasAlreadyLead) {
            throw new RpcException({ code: 9, message: 'Team already has a lead' });
        }

        let newLead = await this.repo.findMember(dto.teamId, dto.userId);
        if (!newLead) {
            const campaignMember = await this.repo.findCampaignMember(team.campaignId, dto.userId);
            if (!campaignMember) {
                throw new RpcException({ code: 9, message: 'User must be a member of the campaign or team to become a lead' });
            }

            newLead = await this.repo.addMember({
                teamId: dto.teamId,
                userProfileId: dto.userId,
                roleId: campaignMember.roleId
            }, user.scope);
        }

        if (!newLead) throw new RpcException({ code: 13, message: 'Internal error: lead member not found' });


        const teamLeadRole = await this.roleService.findByPriorityAndContext(
            RolePriority.LEAD, ScopeType.CAMPAIGN, team.campaignId
        );
        if (!teamLeadRole) throw new RpcException({ code: 5, message: 'Role Team Lead not found' });

        const mediaBuyerRole = await this.roleService.findByPriorityAndContext(
            RolePriority.MEMBER, ScopeType.CAMPAIGN, team.campaignId
        );
        if (!mediaBuyerRole) throw new RpcException({ code: 5, message: 'Role Media Buyer not found' });

        if (team.teamLeadId && team.teamLeadId !== newLead.id) {
            const oldLead = team.teamLead;
            if (oldLead) {
                await this.roleService.updateMemberRole(oldLead.userProfileId, dto.teamId, team.campaignId, mediaBuyerRole.id, ScopeType.TEAM);
                await this.roleService.updateCampaignMemberRole(oldLead.userProfileId, mediaBuyerRole.id, team.campaignId);
            }
        }


        await this.roleService.updateMemberRole(dto.userId, dto.teamId, team.campaignId, teamLeadRole.id, ScopeType.TEAM);
        await this.roleService.updateCampaignMemberRole(dto.userId, teamLeadRole.id, team.campaignId);
        await this.repo.update(dto.teamId, { teamLeadId: newLead.id });
        await this.repo.transferWorkingObjectOwnership(dto.teamId, newLead.id);

        return newLead.id;
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