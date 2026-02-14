import { Injectable } from '@nestjs/common';
import { Prisma, PrismaService } from '../../../pwa-prisma/src';
import { PaginationQueryDto, RoleFilterQueryDto, ScopeType } from '../../../pwa-shared/src';

@Injectable()
export class RoleRepository {
    constructor(private prisma: PrismaService) {}

    private get roleInclude() {
        return {
            accessProfile: {
                include: {
                    accessProfile: {
                        include: {
                            globalRules: true
                        }
                    }
                }
            }
        };
    }

    async getUserPriority(userId: string, scope: ScopeType, contextId?: string): Promise<number> {
        let priority = 999;

        if (scope === ScopeType.SYSTEM) {
            const user = await this.prisma.systemUser.findUnique({
                where: { userProfileId: userId },
                select: { role: { select: { priority: true } } }
            });
            if (user?.role) priority = user.role.priority;
        }
        else if (scope === ScopeType.CAMPAIGN && contextId) {
            const user = await this.prisma.campaignUser.findUnique({
                where: { userProfileId: userId },
                select: { role: { select: { priority: true } } }
            });
            if (user?.role) priority = user.role.priority;
        }
        else if (scope === ScopeType.TEAM && contextId) {
            const user = await this.prisma.teamUser.findUnique({
                where: { userProfileId: userId },
                select: { role: { select: { priority: true } } }
            });
            if (user?.role) priority = user.role.priority;
        }

        return priority;
    }

    async findById(id: number) {
        return this.prisma.role.findUnique({
            where: { id },
            include: this.roleInclude
        });
    }

    async findByNameAndContext(name: string, scope: ScopeType, contextId?: string) {
        const where: Prisma.RoleWhereInput = { name, scope };

        if (scope === ScopeType.CAMPAIGN && contextId) where.campaignId = contextId;
        else if (scope === ScopeType.TEAM && contextId) where.teamId = contextId;
        else {
            where.campaignId = null;
            where.teamId = null;
        }

        return this.prisma.role.findFirst({
            where,
            include: this.roleInclude
        });
    }

    async findAll(
        pagination: PaginationQueryDto,
        filters: RoleFilterQueryDto & { scope?: string; contextId?: string }
    ) {
        const { limit = 10, offset = 0 } = pagination;
        const { campaignId, teamId, search, scope, contextId } = filters;

        const andConditions: Prisma.RoleWhereInput[] = [];

        if (scope === ScopeType.CAMPAIGN) {
            andConditions.push({
                OR: [
                    { campaignId: contextId },
                ]
            });
        } else if (scope === ScopeType.TEAM) {
            andConditions.push({ teamId: contextId });
        }

        if (campaignId) andConditions.push({ campaignId });
        if (teamId) andConditions.push({ teamId });

        if (search) {
            andConditions.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            });
        }

        const where: Prisma.RoleWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

        const [items, total] = await this.prisma.$transaction([
            this.prisma.role.findMany({
                where,
                take: Number(limit),
                skip: Number(offset),
                include: this.roleInclude,
                orderBy: { priority: 'asc' }
            }),
            this.prisma.role.count({ where })
        ]);

        return { items, total };
    }

    async create(
        roleData: Prisma.RoleCreateInput,
        accessProfileName: string,
        globalRulesData: Prisma.GlobalAccessRulesCreateInput
    ) {
        return this.prisma.$transaction(async (tx) => {
            let role = await tx.role.create({ data: roleData });
            const profile = await tx.accessProfile.create({
                data: {
                    name: accessProfileName,
                    globalRules: {
                        create: globalRulesData
                    }
                }
            });

            await tx.roleAccess.create({
                data: { roleId: role.id, accessProfileId: profile.id }
            });

            role = await tx.role.findUniqueOrThrow({
                where: { id: role.id },
                include: {
                    accessProfile: {
                        include: {
                            accessProfile: {
                                include: { globalRules: true }
                            }
                        }
                    }
                }
            });
            return role
        });
    }

    async update(
        roleId: number,
        roleData: Prisma.RoleUpdateInput,
        profileId: string,
        globalRulesData: Prisma.GlobalAccessRulesUpdateInput
    ) {
        return this.prisma.$transaction(async (tx) => {
            await tx.accessProfile.update({
                where: { id: profileId },
                data: {
                    globalRules: {
                        update: globalRulesData
                    }
                }
            });

            const updatedRole = await tx.role.update({
                where: { id: roleId },
                data: roleData
            });

            return updatedRole;
        });
    }

    async delete(id: number) {
        return this.prisma.$transaction(async (tx) => {
            const relation = await tx.roleAccess.findUnique({
                where: { roleId: id },
                include: { accessProfile: true }
            });

            await tx.role.delete({ where: { id } });

            if (relation && relation.accessProfile) {
                const profile = relation.accessProfile;
                await tx.accessProfile.delete({ where: { id: profile.id } });

                if (profile.globalRulesId) {
                    await tx.globalAccessRules.delete({ where: { id: profile.globalRulesId } });
                }
            }
        });
    }

    async assignUserToContext(
        userProfileId: string,
        roleId: number,
        scope: ScopeType,
        contextId?: string
    ) {
        if (scope === ScopeType.CAMPAIGN) {
            if (!contextId) throw new Error("Context ID required");
            return this.prisma.campaignUser.upsert({
                where: { userProfileId },
                update: { campaignId: contextId, roleId },
                create: { userProfileId, campaignId: contextId, roleId }
            });
        }
        else if (scope === ScopeType.TEAM) {
            if (!contextId) throw new Error("Context ID required");
            return this.prisma.teamUser.upsert({
                where: { userProfileId },
                update: { teamId: contextId, roleId },
                create: { userProfileId, teamId: contextId, roleId }
            });
        }
        else if (scope === ScopeType.SYSTEM) {
            return this.prisma.systemUser.upsert({
                where: { userProfileId },
                update: { roleId },
                create: { userProfileId, roleId }
            });
        }
    }
}