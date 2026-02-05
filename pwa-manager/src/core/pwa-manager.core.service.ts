import { Injectable, Logger } from '@nestjs/common';
import { PwaManagerRepository } from './pwa-manager.repository';
import { CreateAppDto } from '../../../pwa-shared/src'
import {GeneratorPublisher} from "../generator/generator.publisher";


@Injectable()
export class PwaManagerCoreService {
    private readonly logger = new Logger(PwaManagerCoreService.name);

    constructor(
        private readonly repo: PwaManagerRepository,
        private readonly builderPub: GeneratorPublisher
    ) {}

    async createApp(data: CreateAppDto) {
        this.logger.log(`Creating PWA app record: ${data.name}`);
        // const pwaApp = await this.repo.createApp({
        //     name: data.name,
        //     domain: data.domain,
        //     description: data.description,
        //     createdByUserId: data.createdByUserId,
        // });

        await this.builderPub.createApp({
            domain: data.domain,
            appId: "test",

        });
        return {
            name: data.name,
            appId: "test",
            buildUrl: `https://${data.domain}?pixel_id=1234567890&fbclid=XYZ123&utm_source=facebook&sub1=aff1&offer_id=777`
        }
    }

    async getApp(id: string) {
        return this.repo.getAppById(id);
    }
}