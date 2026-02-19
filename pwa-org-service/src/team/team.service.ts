import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TeamRepository } from './team.repository';
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
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";


@Injectable()
export class TeamService {
    constructor(private readonly repo: TeamRepository) { }

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
        return this.mapToResponse(team);
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

        await this.repo.delete(id);
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

        const member = await this.repo.findMember(dto.teamId, dto.userId);
        if (!member) throw new RpcException({ code: 9, message: 'User must be a member of the team to become a lead' });

        const updated = await this.repo.update(dto.teamId, {
            teamLeadId: member.id
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
                team_id: m.teamId,
                campaign_id: team.campaignId,
                username: m.profile.username,
            })) : []
        };
    }
}