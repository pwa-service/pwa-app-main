import { Injectable } from '@nestjs/common';
import { CreateCampaignDto, PaginationQueryDto, UpdateCampaignDto } from "../../../pwa-shared/src";
import { PrismaService } from "../../../pwa-prisma/src";
import { CampaignFiltersQueryDto } from "../../../pwa-shared/src/types/org/campaign/dto/filters-query.dto";
import { Prisma } from "../../../pwa-prisma/src";

@Injectable()
export class CampaignRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateCampaignDto) {
        return this.prisma.campaign.create({
            data: {
                name: data.name,
                owner: {
                    connect: {
                        id: data.ownerId,
                    }
                }
            },
        });
    }

    async createFullCrudProfile(campaignId: string) {
        return this.prisma.accessProfile.create({
            data: {
                name: `WO_Share_Owner_${campaignId}_${Date.now()}`,
                crudRules: {
                    create: {
                        read: true,
                        update: true,
                        delete: true
                    }
                }
            }
        });
    }

    async findWorkingObjectLink(campaignId: string) {
        return this.prisma.workingObjectCampaign.findUnique({
            where: { campaignId }
        });
    }

    async findOne(id: string) {
        return this.prisma.campaign.findUnique({
            where: { id },
        });
    }

    async findAll(pagination?: PaginationQueryDto, filters?: CampaignFiltersQueryDto) {
        const where: Prisma.CampaignWhereInput = filters ? {
            ...(filters.ownerUsername ? {
                owner: {
                    username: {
                        contains: filters.ownerUsername,
                        mode: 'insensitive'
                    }
                }
            } : {}),
            ...(filters.search ? {
                name: { contains: filters.search, mode: 'insensitive' }
            } : {}),

        } : {};

        const [items, total] = await Promise.all([
            this.prisma.campaign.findMany({
                where,
                take: pagination?.limit || 10,
                skip: pagination?.offset || 0,
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: true
                }
            }),
            this.prisma.campaign.count({ where }),
        ]);

        return { items, total };
    }

    async update(data: UpdateCampaignDto) {
        const id = data.id
        delete data.id;
        return this.prisma.campaign.update({
            where: { id: id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.$transaction(async (tx) => {
            await tx.team.deleteMany({
                where: { campaignId: id }
            });

            await tx.campaignUser.deleteMany({
                where: { campaignId: id }
            });

            await tx.role.deleteMany({
                where: { campaignId: id }
            });

            return tx.campaign.delete({
                where: { id }
            });
        });
    }

    async addMember(userId: string, campaignId: string, roleId: number) {
        return this.prisma.campaignUser.create({
            data: {
                userProfileId: userId,
                campaignId: campaignId,
                roleId: roleId
            },
            include: {
                role: true,
                profile: true
            }
        });
    }
}