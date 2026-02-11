import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../pwa-prisma/src';
import { PaginationQueryDto } from "../../../pwa-shared/src";
import { PrismaService } from "../../../pwa-prisma/src";
import { ScopeType, RoleFilterQueryDto } from '../../../pwa-shared/src'

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

    async findAll(pagination: PaginationQueryDto, filters: RoleFilterQueryDto) {
        const { limit = 10, offset = 0 } = pagination;
        const { campaignId, teamId, search } = filters;
        const where: Prisma.RoleWhereInput = {};

        if (campaignId) where.campaignId = campaignId;
        if (teamId) where.teamId = teamId;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

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