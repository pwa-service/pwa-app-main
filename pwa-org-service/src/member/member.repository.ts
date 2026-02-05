import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../pwa-prisma/src';
import { PaginationQueryDto, MemberFilterQueryDto } from '../../../pwa-shared/src';
import { Prisma } from '../../../pwa-prisma/src';

@Injectable()
export class MemberRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(pagination: PaginationQueryDto, filters: MemberFilterQueryDto) {
        const { take, skip } = this.getPaginationParams(pagination);
        const { search, roleId, teamId, campaignId } = filters;

        if (teamId) {
            return this.findAllTeamMembers(teamId, take, skip, search, roleId);
        } else if (campaignId) {
            return this.findAllCampaignMembers(campaignId, take, skip, search, roleId);
        } else {
            return this.findAllCampaignMembers(undefined, take, skip, search, roleId);
        }
    }

    private getPaginationParams(pagination?: PaginationQueryDto) {
        return {
            take: Number(pagination?.limit) || 10,
            skip: Number(pagination?.offset) || 0
        };
    }

    private async findAllTeamMembers(
        teamId: string,
        take: number,
        skip: number,
        search?: string,
        roleId?: number
    ) {
        const where: Prisma.TeamUserWhereInput = { teamId };

        if (roleId) where.roleId = roleId;
        if (search) {
            where.profile = {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } }
                ]
            };
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.teamUser.findMany({
                where,
                take,
                skip,
                include: { role: true, profile: true },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.teamUser.count({ where })
        ]);

        return { items, total };
    }

    private async findAllCampaignMembers(
        campaignId: string | undefined,
        take: number,
        skip: number,
        search?: string,
        roleId?: number
    ) {
        const where: Prisma.CampaignUserWhereInput = {};

        if (campaignId) where.campaignId = campaignId;
        if (roleId) where.roleId = roleId;
        if (search) {
            where.profile = {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } }
                ]
            };
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.campaignUser.findMany({
                where,
                take,
                skip,
                include: { role: true, profile: true },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.campaignUser.count({ where })
        ]);

        return { items, total };
    }
}