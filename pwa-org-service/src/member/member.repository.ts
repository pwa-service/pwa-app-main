import { Injectable } from '@nestjs/common';
import { Prisma, PrismaService } from '../../../pwa-prisma/src';
import { MemberFilterQueryDto, PaginationQueryDto, ScopeType } from '../../../pwa-shared/src';


@Injectable()
export class MemberRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(pagination: PaginationQueryDto, filters: MemberFilterQueryDto & { userScope?: ScopeType, userContextId?: string, excludeUserId?: string }) {
        const { take, skip } = this.getPaginationParams(pagination);
        const { search, roleId, teamId, campaignId, userScope, userContextId, excludeUserId } = filters;

        const campConditions: Prisma.CampaignUserWhereInput[] = [];
        const teamConditions: Prisma.TeamUserWhereInput[] = [];

        let fetchCampaigns = false;
        let fetchTeams = false;

        if (userScope === ScopeType.SYSTEM) {
            fetchCampaigns = true;
            fetchTeams = true;
        }
        else if (userScope === ScopeType.CAMPAIGN) {
            fetchCampaigns = true;
            fetchTeams = true;
            campConditions.push({ campaignId: userContextId });
            teamConditions.push({ team: { campaignId: userContextId } });
        }
        else if (userScope === ScopeType.TEAM) {
            fetchTeams = true;
            teamConditions.push({ teamId: userContextId });
        }

        if (campaignId) {
            campConditions.push({ campaignId });
            fetchTeams = false;
        }
        if (teamId) {
            teamConditions.push({ teamId });
            fetchCampaigns = false;
        }
        if (roleId) {
            campConditions.push({ roleId });
            teamConditions.push({ roleId });
        }

        if (search) {
            const searchObj: Prisma.UserProfileWhereInput = {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } }
                ]
            };
            campConditions.push({ profile: searchObj });
            teamConditions.push({ profile: searchObj });
        }

        if (excludeUserId) {
            campConditions.push({ NOT: { userProfileId: excludeUserId } });
            teamConditions.push({ NOT: { userProfileId: excludeUserId } });
        }

        const campWhere: Prisma.CampaignUserWhereInput = campConditions.length > 0 ? { AND: campConditions } : {};
        const teamWhere: Prisma.TeamUserWhereInput = teamConditions.length > 0 ? { AND: teamConditions } : {};

        if (fetchCampaigns && !fetchTeams) {
            return this.executeQueries(this.prisma.campaignUser, campWhere, take, skip);
        }
        if (fetchTeams && !fetchCampaigns) {
            return this.executeQueries(this.prisma.teamUser, teamWhere, take, skip);
        }

        const [campItems, campTotal, teamItems, teamTotal] = await Promise.all([
            this.prisma.campaignUser.findMany({ where: campWhere, include: { role: true, profile: true } }),
            this.prisma.campaignUser.count({ where: campWhere }),
            this.prisma.teamUser.findMany({ where: teamWhere, include: { role: true, profile: true, team: true } }),
            this.prisma.teamUser.count({ where: teamWhere })
        ]);

        const allItems = [...campItems, ...teamItems].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        // Deduplicate: a user in both campaign + team tables should appear only once
        // Team entry takes priority over campaign entry (more specific context)
        const seenIds = new Set<string>();
        const deduped = allItems.filter((item) => {
            if (seenIds.has(item.userProfileId)) return false;
            seenIds.add(item.userProfileId);
            return true;
        });

        const paginatedItems = deduped.slice(skip, skip + take);

        return { items: paginatedItems, total: deduped.length };
    }

    private getPaginationParams(pagination?: PaginationQueryDto) {
        return {
            take: Number(pagination?.limit) || 10,
            skip: Number(pagination?.offset) || 0
        };
    }

    private async executeQueries(model: any, where: any, take: number, skip: number) {
        const [items, total] = await Promise.all([
            model.findMany({
                where,
                take,
                skip,
                include: { role: true, profile: true, team: true },
                orderBy: { createdAt: 'desc' }
            }),
            model.count({ where })
        ]);
        return { items, total };
    }

    async deleteUser(userId: string) {
        return this.prisma.$transaction(async (tx) => {
            await tx.shareUserProfile.deleteMany({
                where: { createdBy: userId },
            });
            await tx.userProfile.delete({
                where: { id: userId },
            });
        });
    }
}