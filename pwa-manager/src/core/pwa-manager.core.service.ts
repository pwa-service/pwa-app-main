import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PwaManagerRepository, PwaAppWithRelations } from './pwa-manager.repository';
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
                productUrl: data.productUrl
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
        return this.mapToResponse(updated);
    }

    async deleteApp(id: string) {
        const app = await this.repo.getAppById(id);
        if (!app) throw new NotFoundException('App not found');

        await this.repo.delete(id);
        return { success: true, id };
    }

    private mapToResponse(app: any) {
        const domain = app.domains?.[0]?.hostname || '';

        const content = app.contents?.find((c: any) => c.locale === app.mainLocale) || app.contents?.[0];

        return {
            id: app.id,
            name: app.name,
            domain: domain,
            description: content?.description || '',
            status: app.status,
            main_locale: app.mainLocale,
            campaign_id: app.campaignId,
            build_url: domain ? `https://${domain}?app_id=${app.id}` : ''
        };
    }
}