import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../pwa-prisma/src';
import { CreateAppDto, UpdateAppDto, PaginationQueryDto, PwaAppStatus } from '../../../pwa-shared/src';
import { Prisma, PwaStatus } from '@prisma/client';


const appInclude = {
    details: true,
    contents: true,
    tags: true,
    terms: true,
    comments: true,
    eventsProfile: true,
    campaign: { select: { id: true, name: true } },
    domains: true
} satisfies Prisma.PwaAppInclude;


export type PwaAppWithRelations = Prisma.PwaAppGetPayload<{ include: typeof appInclude }>;

@Injectable()
export class PwaManagerRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createApp(data: CreateAppDto) {
        const eventsConfig = this.mapEventsToProfile(data.events);

        const campaignUser = await this.prisma.campaignUser.findUnique({
            where: { userProfileId: data.ownerId },
            select: { campaignId: true }
        });

        if (!campaignUser) {
            throw new Error('User is not linked to any campaign');
        }

        const campaignId = campaignUser.campaignId;

        return this.prisma.$transaction(async (tx) => {
            const pwaApp = await tx.pwaApp.create({
                data: {
                    name: data.name,
                    status: (data.status as unknown as PwaStatus) || PwaStatus.draft,
                    mainLocale: data.lang,
                    domainId: data.domainId,
                    destinationUrl: data.destinationUrl,
                    productUrl: data.productUrl,
                    author: data.author,
                    rating: data.rating,
                    installCount: data.installCount,
                    reviews: data.reviews,
                    downloadSize: data.downloadSize,

                    campaign: { connect: { id: campaignId } },
                    details: { create: { publicName: data.name } },
                    contents: {
                        create: {
                            locale: data.lang,
                            title: data.name,
                            description: data.description
                        }
                    },
                    tags: { create: data.tags.map(t => ({ text: t.text })) },
                    terms: { create: data.terms.map(t => ({ text: t.text })) },
                    comments: { create: data.comments.map(c => ({ author: c.author, text: c.text })) },
                    eventsProfile: { create: eventsConfig }
                },
                include: appInclude
            });

            await tx.domain.update({
                where: { id: data.domainId },
                data: {
                    status: 'inactive',
                    ownerId: data.ownerId,
                    pwaAppId: pwaApp.id
                }
            });

            return tx.pwaApp.findUniqueOrThrow({
                where: { id: pwaApp.id },
                include: appInclude
            });
        });
    }

    async getAppById(id: string) {
        return this.prisma.pwaApp.findUnique({
            where: { id },
            include: appInclude
        });
    }

    async findAll(pagination: PaginationQueryDto) {
        const { limit = 10, offset = 0 } = pagination;
        const [items, total] = await this.prisma.$transaction([
            this.prisma.pwaApp.findMany({
                take: Number(limit),
                skip: Number(offset),
                orderBy: { createdAt: 'desc' },
                include: appInclude
            }),
            this.prisma.pwaApp.count()
        ]);
        return { items, total };
    }

    async update(id: string, data: UpdateAppDto) {
        return this.prisma.$transaction(async (tx) => {
            await tx.pwaApp.update({
                where: { id },
                data: {
                    name: data.name,
                    status: data.status ? (data.status as unknown as PwaStatus) : undefined,
                    mainLocale: data.lang,
                    destinationUrl: data.destinationUrl,
                    productUrl: data.productUrl,
                    author: data.author,
                    rating: data.rating,
                    installCount: data.installCount,
                    reviews: data.reviews,
                    downloadSize: data.downloadSize,
                    details: { update: { publicName: data.name } }
                }
            });

            if (data.description || data.name) {
                await tx.pwaContent.updateMany({
                    where: { pwaAppId: id, locale: data.lang },
                    data: { description: data.description, title: data.name }
                });
            }

            if (data.tags) {
                await tx.pwaTag.deleteMany({ where: { pwaAppId: id } });
                await tx.pwaTag.createMany({ data: data.tags.map(t => ({ pwaAppId: id, text: t.text })) });
            }
            if (data.terms) {
                await tx.pwaTerm.deleteMany({ where: { pwaAppId: id } });
                await tx.pwaTerm.createMany({ data: data.terms.map(t => ({ pwaAppId: id, text: t.text })) });
            }
            if (data.comments) {
                await tx.pwaComment.deleteMany({ where: { pwaAppId: id } });
                await tx.pwaComment.createMany({ data: data.comments.map(c => ({ pwaAppId: id, author: c.author, text: c.text })) });
            }

            if (data.events) {
                const eventsConfig = this.mapEventsToProfile(data.events);
                await tx.pwaEventsProfile.upsert({
                    where: { pwaAppId: id },
                    create: { ...eventsConfig, pwaAppId: id },
                    update: eventsConfig
                });
            }

            return tx.pwaApp.findUniqueOrThrow({
                where: { id },
                include: appInclude
            });
        });
    }

    async delete(id: string) {
        return this.prisma.$transaction(async (tx) => {
            await tx.pwaDetails.deleteMany({ where: { pwaAppId: id } });
            await tx.pwaContent.deleteMany({ where: { pwaAppId: id } });
            await tx.pwaEventsConfig.deleteMany({ where: { pwaAppId: id } });
            await tx.pwaVersion.deleteMany({ where: { pwaAppId: id } });

            await tx.domain.updateMany({
                where: { pwaAppId: id },
                data: { pwaAppId: null, ownerId: null }
            });

            await tx.pwaSession.updateMany({
                where: { pwaAppId: id },
                data: { pwaAppId: null }
            });

            await tx.eventLog.updateMany({
                where: { pwaAppId: id },
                data: { pwaAppId: null }
            });

            await tx.flow.updateMany({
                where: { pwaAppId: id },
                data: { pwaAppId: null }
            });

            return tx.pwaApp.delete({ where: { id } });
        });
    }

    async setDomainActive(domainId: string) {
        return this.prisma.domain.update({
            where: { id: domainId },
            data: {
                status: 'active',
                ownerId: null,
                pwaAppId: null,
            }
        });
    }

    private mapEventsToProfile(events: string[] = []) {
        return {
            viewContent: events.includes('view-content'),
            firstOpen: events.includes('first-open'),
            reg: events.includes('reg'),
            sub: events.includes('sub'),
            dep: events.includes('dep'),
            redep: events.includes('redep'),
        };
    }
}