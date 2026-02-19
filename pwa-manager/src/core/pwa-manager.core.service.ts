import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PwaManagerRepository } from './pwa-manager.repository';
import { CreateAppDto, UpdateAppDto, PaginationQueryDto } from '../../../pwa-shared/src';
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
                installCount: data.installCount,
                reviews: data.reviews,
                downloadSize: data.downloadSize,
            }
        };

        await this.builderPub.createApp(builderPayload);
        return this.mapToResponse(pwaApp);
    }

    async getApp(id: string) {
        const app = await this.repo.getAppById(id);
        if (!app) throw new NotFoundException(`App with ID ${id} not found`);
        return this.mapToResponse(app);
    }

    async getAllApps(pagination: PaginationQueryDto) {
        const { items, total } = await this.repo.findAll(pagination);
        return {
            items: items.map(item => this.mapToResponse(item)),
            total
        };
    }

    async updateApp(id: string, dto: UpdateAppDto) {
        const app = await this.repo.getAppById(id);
        if (!app) throw new NotFoundException('App not found');

        const updated = await this.repo.update(id, dto);

        const hostname = updated.domains?.[0]?.hostname;
        if (hostname) {
            const content = updated.contents?.find((c: any) => c.locale === updated.mainLocale) || updated.contents?.[0];
            const rebuildPayload = {
                appId: updated.id,
                domain: hostname,
                config: {
                    name: updated.name,
                    description: content?.description || '',
                    lang: updated.mainLocale || 'en',
                    tags: updated.tags?.map((t: any) => ({ text: t.text })) || [],
                    terms: updated.terms?.map((t: any) => ({ text: t.text })) || [],
                    comments: updated.comments?.map((c: any) => ({ author: c.author, text: c.text })) || [],
                    events: this.mapProfileToEvents(updated.eventsProfile),
                    destinationUrl: updated.destinationUrl || '',
                    productUrl: updated.productUrl || '',
                    author: updated.author || '',
                    rating: updated.rating || '',
                    installCount: updated.installCount || '',
                    reviews: updated.reviews || '',
                    downloadSize: updated.downloadSize || '',
                }
            };

            this.logger.log(`Triggering rebuild for app ${id} on domain ${hostname}`);
            await this.builderPub.rebuildApp(rebuildPayload);
        }

        return this.mapToResponse(updated);
    }

    async deleteApp(id: string) {
        const app = await this.repo.getAppById(id);
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
        const map: Record<string, string> = {
            viewContent: 'view-content',
            firstOpen: 'first-open',
            reg: 'reg',
            sub: 'sub',
            dep: 'dep',
            redep: 'redep',
        };
        return Object.entries(map)
            .filter(([key]) => profile[key] === true)
            .map(([, value]) => value);
    }

    private mapToResponse(app: any) {
        const domain = app.domains?.[0]?.hostname || '';
        return {
            id: app.id,
            name: app.name,
            domain: domain,
            status: app.status,
            buildUrl: domain ? `https://${domain}?pixel_id=<your-pixel-id>&fbclid=<your-fb-clid>&utm_source=facebook&sub1=<your-sub>&offer_id=<your-offer-id>` : ''
        };
    }
}