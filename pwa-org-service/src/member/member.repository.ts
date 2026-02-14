import {Injectable} from '@nestjs/common';
import {Prisma, PrismaService} from '../../../pwa-prisma/src';
import {MemberFilterQueryDto, PaginationQueryDto, ScopeType} from '../../../pwa-shared/src';


@Injectable()
export class MemberRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(pagination: PaginationQueryDto, filters: MemberFilterQueryDto & { scope?: ScopeType, contextId?: string }) {
        const { take, skip } = this.getPaginationParams(pagination);
        const { search, roleId, teamId, campaignId, scope, contextId } = filters;

        const campWhere: Prisma.CampaignUserWhereInput = {};
        const teamWhere: Prisma.TeamUserWhereInput = {};

        let fetchCampaigns = false;
        let fetchTeams = false;

        if (scope === ScopeType.SYSTEM) {
            fetchCampaigns = true;
            fetchTeams = true;
        }
        else if (scope === ScopeType.CAMPAIGN) {
            fetchCampaigns = true;
            fetchTeams = true;
            campWhere.campaignId = contextId;
            teamWhere.team = { campaignId: contextId };
        }
        else if (scope === ScopeType.TEAM) {
            fetchTeams = true;
            teamWhere.teamId = contextId;
        }

        if (campaignId) {
            campWhere.campaignId = campaignId;
            fetchTeams = false;
        }
        if (teamId) {
            teamWhere.teamId = teamId;
            fetchCampaigns = false;
        }
        if (roleId) {
            campWhere.roleId = roleId;
            teamWhere.roleId = roleId;
        }

        if (search) {
            const searchObj: Prisma.UserProfileWhereInput = {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } }
                ]
            };
            campWhere.profile = searchObj;
            teamWhere.profile = searchObj;
        }

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

        const paginatedItems = allItems.slice(skip, skip + take);

        return { items: paginatedItems, total: campTotal + teamTotal };
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
}