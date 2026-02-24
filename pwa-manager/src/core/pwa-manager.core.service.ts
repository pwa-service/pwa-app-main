import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PwaManagerRepository } from './pwa-manager.repository';
import { CreateAppDto, UpdateAppDto, PaginationQueryDto, PwaAppFiltersQueryDto } from '../../../pwa-shared/src';
import { GeneratorPublisher } from '../generator/generator.publisher';
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";

@Injectable()
export class PwaManagerCoreService {
    private readonly logger = new Logger(PwaManagerCoreService.name);

    constructor(
        private readonly repo: PwaManagerRepository,
        private readonly builderPub: GeneratorPublisher
    ) { }

    async createApp(data: CreateAppDto, user: UserPayload) {
        this.logger.log(`Creating PWA app record: ${data.name}`);

        const pwaApp = await this.repo.createApp({
            ...data,
            ownerId: user.id,
        });

        const hostname = pwaApp.domains?.[0]?.hostname;
        const builderPayload = {
            appId: pwaApp.id,
            domain: hostname || 'unknown',
            config: {
                name: data.name,
                description: data.description,
                lang: data.lang,
                tags: data.tags,
                terms: data.terms,
                comments: data.comments,
                events: data.events,
                destinationUrl: data.destinationUrl,
                productUrl: data.productUrl,
                author: data.author,
                rating: data.rating,

                adsText: data.adsText,
                category: data.category,
                categorySubtitle: data.categorySubtitle,
                reviewsCount: data.reviewsCount,
                reviewsCountLabel: data.reviewsCountLabel,
                appSize: data.appSize,
                appSizeLabel: data.appSizeLabel,
                installCount: data.installCount,
                installCountLabel: data.installCountLabel,
                ageLimit: data.ageLimit,
                ageLimitLabel: data.ageLimitLabel,
                iconUrl: (pwaApp as any).iconUrl || '',
                galleryUrls: (pwaApp as any).galleryUrls || [],
            }
        };

        await this.builderPub.createApp(builderPayload);
        return this.mapToResponse(pwaApp);
    }

    async findOne(id: string) {
        const app = await this.repo.findOne(id);
        if (!app) throw new NotFoundException(`App with ID ${id} not found`);
        return this.mapToResponse(app);
    }

    async getAllApps(pagination: PaginationQueryDto, filters: PwaAppFiltersQueryDto | undefined, user: UserPayload) {
        const { items, total } = await this.repo.findAll(pagination, filters, user);
        return {
            items: items.map(item => this.mapToResponse(item)),
            total
        };
    }

    async updateApp(id: string, dto: UpdateAppDto) {
        const app = await this.repo.findOne(id);
        if (!app) throw new NotFoundException('App not found');

        const updated = await this.repo.update(id, dto);
        const hostname = updated.domains?.[0]?.hostname;
        if (hostname) {
            const builderPayload = {
                appId: updated.id,
                domain: hostname,
                config: this.mapToConfig(updated) 
            };

            this.logger.log(`Triggering rebuild for app ${id} on domain ${hostname}`);
            await this.builderPub.rebuildApp(builderPayload);
        }
        return this.mapToResponse(updated);
    }

    async deleteApp(id: string) {
        const app = await this.repo.findOne(id);
        if (!app) throw new NotFoundException('App not found');

        const hostname = app.domains?.[0]?.hostname;
        const domainId = app.domains?.[0]?.id;

        await this.repo.delete(id);

        if (hostname) {
            this.logger.log(`Publishing delete event for app ${id} on domain ${hostname}`);
            await this.builderPub.deleteApp({
                appId: id,
                domain: hostname,
                domainId: domainId,
            });
        }

        return { success: true, id };
    }

    private mapProfileToEvents(profile: any): string[] {
        if (!profile) return [];
        const events: string[] = [];
        for (const [key, value] of Object.entries(profile)) {
            if (value === true) {
                events.push(key);
            }
        }
        return events;
    }

    private mapToConfig(app: any) {
        const content = app.contents?.find((c: any) => c.locale === app.mainLocale) || app.contents?.[0];
        return {
            name: app.name,
            description: content?.description || '',
            lang: app.mainLocale || 'en',
            tags: app.tags?.map((t: any) => ({ text: t.text })) || [],
            terms: app.terms?.map((t: any) => ({ text: t.text })) || [],
            comments: app.comments?.map((c: any) => ({ author: c.author, text: c.text })) || [],
            events: this.mapProfileToEvents(app.eventsProfile),
            destinationUrl: app.destinationUrl || '',
            productUrl: app.productUrl || '',
            author: app.author || '',
            rating: app.rating || '',
            adsText: app.adsText || '',
            category: app.category || '',
            categorySubtitle: app.categorySubtitle || '',
            reviewsCount: Number(app.reviewsCount) || 0,
            reviewsCountLabel: app.reviewsCountLabel || '',
            appSize: Number(app.appSize) || 0,
            appSizeLabel: app.appSizeLabel || '',
            installCount: Number(app.installCount) || 0,
            installCountLabel: app.installCountLabel || '',
            ageLimit: Number(app.ageLimit) || 0,
            ageLimitLabel: app.ageLimitLabel || '',
            iconUrl: app.iconUrl || '',
            galleryUrls: app.galleryUrls || [],
        };
    }

    private mapToResponse(app: any) {
        const domainObj = app.domains?.[0];
        const hostname = domainObj?.hostname || '';
        const domainId = domainObj?.id || '';

        return {
            id: app.id,
            name: app.name,
            domain: hostname,
            domainId,
            status: app.status,
            buildUrl: hostname ? `https://${hostname}?pixel_id=<your-pixel-id>&fbclid=<your-fb-clid>&utm_source=facebook&sub1=<your-sub>&offer_id=<your-offer-id>` : '',
            config: this.mapToConfig(app),
            campaignId: app.campaign?.id || '',
            campaignName: app.campaign?.name || '',
            teamId: app.team?.id,
            teamName: app.team?.name,
            destinationUrl: app.destinationUrl || '',
            productUrl: app.productUrl || '',
            ownerId: app.creatorCampaign?.userProfileId || app.creatorTeam?.userProfileId || '',
            ownerName: app.creatorCampaign?.profile?.username || app.creatorTeam?.profile?.username || ''
        };
    }
}