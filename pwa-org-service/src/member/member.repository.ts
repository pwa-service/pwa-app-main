import { Injectable } from '@nestjs/common';
import { Prisma, PrismaService } from '../../../pwa-prisma/src';
import { MemberFilterQueryDto, PaginationQueryDto, ScopeType } from '../../../pwa-shared/src';

@Injectable()
export class MemberRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(pagination: PaginationQueryDto, filters: MemberFilterQueryDto & { userScope?: ScopeType, userContextId?: string, excludeUserId?: string }) {
        const { take, skip } = this.getPaginationParams(pagination);
        const { search, roleId, teamId, campaignId, userScope, userContextId, excludeUserId } = filters;

        const andConditions: Prisma.UserProfileWhereInput[] = [];

        if (excludeUserId) {
            andConditions.push({ id: { not: excludeUserId } });
        }

        if (search) {
            andConditions.push({
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } }
                ]
            });
        }


        if (roleId) {
            andConditions.push({
                OR: [
                    { campaignUser: { roleId: Number(roleId) } },
                    { teamUser: { roleId: Number(roleId) } }
                ]
            });
        }


        if (teamId || userScope === ScopeType.TEAM) {
            const targetTeamId = teamId || userContextId;
            if (targetTeamId) {
                andConditions.push({
                    teamUser: { teamId: targetTeamId }
                });
            }
        }

        else if (campaignId || userScope === ScopeType.CAMPAIGN) {
            const targetCampaignId = campaignId || userContextId;
            if (targetCampaignId) {
                andConditions.push({
                    OR: [
                        { campaignUser: { campaignId: targetCampaignId } },
                        { teamUser: { team: { campaignId: targetCampaignId } } }
                    ]
                });
            }
        }
        else if (userScope === ScopeType.SYSTEM) {
            andConditions.push({
                OR: [
                    { campaignUser: { isNot: null } },
                    { teamUser: { isNot: null } }
                ]
            });
        }

        const where: Prisma.UserProfileWhereInput = { AND: andConditions };
        const [items, total] = await Promise.all([
            this.prisma.userProfile.findMany({
                where,
                take,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    campaignUser: {
                        include: {
                            role: true,
                            campaign: { select: { id: true, name: true } }
                        }
                    },
                    teamUser: {
                        include: {
                            role: true,
                            team: {
                                include: {
                                    campaign: { select: { name: true, id: true } }
                                }
                            }
                        }
                    }
                }
            }),
            this.prisma.userProfile.count({ where })
        ]);

        return { items, total };
    }

    private getPaginationParams(pagination?: PaginationQueryDto) {
        return {
            take: Number(pagination?.limit) || 10,
            skip: Number(pagination?.offset) || 0
        };
    }

    async deleteUser(userId: string) {
        return this.prisma.$transaction(async (tx) => {
            await tx.systemUser.deleteMany({ where: { userProfileId: userId } });
            await tx.campaignUser.deleteMany({ where: { userProfileId: userId } });
            await tx.teamUser.deleteMany({ where: { userProfileId: userId } });
            await tx.globalAccessUser.deleteMany({ where: { userId } });
            await tx.shareUserProfile.deleteMany({
                where: { OR: [{ createdBy: userId }, { userProfileId: userId }] }
            });
            await tx.userProfile.delete({ where: { id: userId } });
        });
    }

    async updateUser(userId: string, data: { email?: string, passwordHash?: string }) {
        return this.prisma.userProfile.update({
            where: { id: userId },
            data,
        });
    }

    async removeCampaignUser(userId: string) {
        return this.prisma.campaignUser.delete({
            where: { userProfileId: userId },
        });
    }

    async getActorCampaignRolePriority(userId: string, campaignId: string): Promise<number> {
        const cu = await this.prisma.campaignUser.findFirst({
            where: { userProfileId: userId, campaignId },
            select: { role: { select: { priority: true } } }
        });
        return cu?.role?.priority ?? 999;
    }

    async getRolePriorityById(roleId: number): Promise<number> {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
            select: { priority: true }
        });
        return role?.priority ?? 999;
    }

    async findOwnedCampaign(userId: string) {
        return this.prisma.campaign.findFirst({
            where: { legalOwnerId: userId },
            select: { id: true, name: true }
        });
    }

    async findLedTeam(userId: string) {
        return this.prisma.team.findFirst({
            where: { teamLead: { userProfileId: userId } },
            select: { id: true, name: true }
        });
    }
}