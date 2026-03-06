import { Injectable } from '@nestjs/common';
import { Prisma, PrismaService, TeamUser } from '../../../pwa-prisma/src';
import { PaginationQueryDto, ScopeType } from "../../../pwa-shared/src";

@Injectable()
export class TeamRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createTeamTransaction(
        teamData: Prisma.TeamUncheckedCreateInput,
        woData: Prisma.WorkingObjectCreateInput,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const team = await tx.team.create({ data: teamData });
            const wo = await tx.workingObject.create({ data: woData });
            await tx.workingObjectTeam.create({
                data: { teamId: team.id, workingObjectId: wo.id },
            });
            return team;
        });
    }

    async findById(id: string) {
        return this.prisma.team.findUnique({
            where: { id },
            include: {
                teamLead: {
                    include: {
                        profile: true,
                        role: true
                    }
                },
                members: {
                    include: {
                        profile: true,
                        role: true
                    }
                }
            },
        });
    }

    async findAll(pagination: PaginationQueryDto, where: Prisma.TeamWhereInput) {
        const take = Number(pagination.limit) || 10;
        const skip = Number(pagination.offset) || 0;

        const [items, total] = await this.prisma.$transaction([
            this.prisma.team.findMany({
                where,
                take,
                skip,
                include: {
                    teamLead: {
                        include: {
                            profile: true,
                            role: true
                        }
                    },
                    members: {
                        include: {
                            profile: true,
                            role: true
                        }
                    },
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.team.count({ where }),
        ]);

        return { items, total };
    }

    async update(id: string, data: Prisma.TeamUncheckedUpdateInput) {
        return this.prisma.team.update({
            where: { id },
            data,
            include: { members: { include: { profile: true, role: true } } }
        });
    }


    async delete(teamId: string, campaignId: string) {
        return this.prisma.$transaction(async (tx) => {
            const teamMembers = await tx.teamUser.findMany({
                where: { teamId },
                select: { userProfileId: true, roleId: true },
            });

            for (const member of teamMembers) {
                await tx.campaignUser.upsert({
                    where: { userProfileId: member.userProfileId },
                    create: {
                        userProfileId: member.userProfileId,
                        campaignId,
                        roleId: member.roleId,
                    },
                    update: {
                        roleId: member.roleId
                    },
                });

                await tx.userProfile.update({
                    where: { id: member.userProfileId },
                    data: { scope: ScopeType.CAMPAIGN }
                });
            }

            await tx.teamUser.deleteMany({
                where: { teamId }
            });

            await tx.role.deleteMany({
                where: { scope: ScopeType.TEAM, teamId },
            });

            await tx.team.delete({
                where: { id: teamId },
            });
        });
    }

    async addMember(data: Prisma.TeamUserUncheckedCreateInput, scope: ScopeType): Promise<any> {
        return this.prisma.$transaction(async (tx) => {
            const userId = data.userProfileId;

            if (scope === ScopeType.CAMPAIGN) {
                await tx.campaignUser.deleteMany({
                    where: { userProfileId: userId }
                });
            }

            const result = await tx.teamUser.upsert({
                where: { userProfileId: userId },
                update: {
                    roleId: data.roleId,
                    teamId: data.teamId
                },
                create: data,
                include: { profile: true, role: true },
            });

            await tx.userProfile.update({
                where: { id: userId },
                data: { scope }
            });

            return result;
        });
    }

    async findMember(teamId: string, userId: string) {
        return this.prisma.teamUser.findUnique({
            where: { userProfileId: userId }
        });
    }

    async hasLead(teamId: string): Promise<boolean> {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            select: { teamLeadId: true }
        });
        return !!team?.teamLeadId;
    }

    async removeMember(userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const teamMember = await tx.teamUser.findFirst({
                where: { userProfileId: userId },
                include: { team: true }
            });

            if (teamMember) {
                const campaignId = teamMember.team.campaignId;

                await tx.campaignUser.upsert({
                    where: { userProfileId: userId },
                    create: {
                        userProfileId: userId,
                        campaignId,
                        roleId: teamMember.roleId,
                    },
                    update: {
                        roleId: teamMember.roleId
                    },
                });

                await tx.teamUser.delete({
                    where: { id: teamMember.id }
                });

                await tx.userProfile.update({
                    where: { id: userId },
                    data: { scope: ScopeType.CAMPAIGN }
                });
            }
        });
    }


    async findCampaignMember(campaignId: string, userId: string) {
        return this.prisma.campaignUser.findFirst({
            where: { campaignId, userProfileId: userId },
        });
    }

    async transferWorkingObjectOwnership(teamId: string, newTeamUserId: string) {
        const woTeam = await this.prisma.workingObjectTeam.findUnique({
            where: { teamId },
        });
        if (!woTeam) return;

        await this.prisma.workingObjectTeamUser.deleteMany({
            where: {
                workingObjectId: woTeam.workingObjectId,
                relation: 'Owner',
            },
        });

        await this.prisma.workingObjectTeamUser.create({
            data: {
                workingObjectId: woTeam.workingObjectId,
                teamUserId: newTeamUserId,
                relation: 'Owner',
            },
        });
    }
}