import { Injectable, Logger } from '@nestjs/common';
import { GeneratorRepository } from './generator.repository';
import { CreateAppDto } from '../../../pwa-shared/src'
import {GeneratorProducer} from "../bullmq/generator.producer";


@Injectable()
export class GeneratorCoreService {
    private readonly logger = new Logger(GeneratorCoreService.name);

    constructor(
        private readonly repo: GeneratorRepository,
        private readonly builder: GeneratorProducer
    ) {}

    async createApp(data: CreateAppDto) {
        this.logger.log(`Creating PWA app record: ${data.name}`);
        await this.builder.createApp({
            name: data.name,
            appId: data.name,
            templateId: data.templateId,

        });
        return {
            name: data.name,
            appId: "544d922f-9bc4-4826-aba3-732df66a0515",
            templateId: data.templateId,

        }
        // this.repo.createApp({
        //     name: data.name,
        //     domain: data.domain,
        //     description: data.description,
        //     createdByUserId: data.createdByUserId,
        // });
    }

    async getApp(id: string) {
        return this.repo.getAppById(id);
    }

}