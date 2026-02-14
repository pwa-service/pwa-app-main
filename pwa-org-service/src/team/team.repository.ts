import { Injectable } from '@nestjs/common';
import { Prisma, PrismaService, TeamUser } from '../../../pwa-prisma/src';
import {PaginationQueryDto} from "../../../pwa-shared/src";

@Injectable()
export class TeamRepository {
    constructor(private readonly prisma: PrismaService) {}

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

    async delete(id: string) {
        return this.prisma.team.delete({
            where: { id },
        });
    }

    async addMember(data: Prisma.TeamUserUncheckedCreateInput): Promise<TeamUser> {
        return this.prisma.teamUser.create({
            data,
            include: { profile: true, role: true },
        });
    }

    async findMember(teamId: string, userId: string) {
        return this.prisma.teamUser.findUnique({
            where: { userProfileId: userId }
        });
    }

    async removeMember(userId: string) {
        return this.prisma.teamUser.delete({
            where: { userProfileId: userId }
        });
    }
}