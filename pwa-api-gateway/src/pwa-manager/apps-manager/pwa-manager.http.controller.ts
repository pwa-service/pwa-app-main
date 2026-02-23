import { Body, Controller, HttpCode, Post, Get, Put, Delete, Req, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PwaManagerGrpcClient } from './pwa-manager.grpc.client';
import { buildGrpcMetadata } from '../../common/jwt-to-metadata';
import {
    CreateAppDto,
    UpdateAppDto,
    PaginationQueryDto,
    PwaAppStatus
} from '../../../../pwa-shared/src';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { JwtAuthGuard } from 'pwa-api-gateway/src/common/jwt-auth.guard';

const pump = promisify(pipeline);

@ApiBearerAuth()
@Controller('pwa-apps-manager')
@UseGuards(JwtAuthGuard)
@ApiTags('Apps Manager')
export class PwaManagerHttpController {
    private readonly uploadDir = join(process.cwd(), 'uploads');

    constructor(private readonly client: PwaManagerGrpcClient) {
        if (!existsSync(this.uploadDir)) {
            mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    @Post('app')
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                domainId: { type: 'string' },
                status: { type: 'string', enum: Object.values(PwaAppStatus) },
                description: { type: 'string' },
                comments: { type: 'string', example: '[]' },
                lang: { type: 'string', example: 'en' },
                terms: { type: 'string', example: '[]' },
                tags: { type: 'string', example: '[]' },
                events: { type: 'string', example: '[]' },
                destinationUrl: { type: 'string' },
                productUrl: { type: 'string' },
                author: { type: 'string' },
                rating: { type: 'string' },
                adsText: { type: 'string' },
                category: { type: 'string' },
                categorySubtitle: { type: 'string' },
                reviewsCount: { type: 'number' },
                reviewsCountLabel: { type: 'string' },
                appSize: { type: 'number' },
                appSizeLabel: { type: 'string' },
                installCount: { type: 'number' },
                installCountLabel: { type: 'string' },
                ageLimit: { type: 'number' },
                ageLimitLabel: { type: 'string' },
                icon: {
                    type: 'string',
                    format: 'binary',
                },
                gallery: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
            required: ['name', 'domainId', 'status', 'lang'],
        },
    })
    @ApiOperation({ summary: 'Creates a new PWA application record with images.' })
    async createApp(@Req() req: any) {
        if (!req.isMultipart()) {
            return this.client.createApp(req.body, buildGrpcMetadata(req));
        }

        const data = await this.parseMultipart(req);
        const finalDto = this.formatDto(data.dto, data.galleryUrls);

        return this.client.createApp(finalDto, buildGrpcMetadata(req));
    }

    @Put('app/:id')
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                domainId: { type: 'string' },
                status: { type: 'string', enum: Object.values(PwaAppStatus) },
                description: { type: 'string' },
                comments: { type: 'string' },
                lang: { type: 'string' },
                terms: { type: 'string' },
                tags: { type: 'string' },
                events: { type: 'string' },
                destinationUrl: { type: 'string' },
                productUrl: { type: 'string' },
                author: { type: 'string' },
                rating: { type: 'string' },
                adsText: { type: 'string' },
                category: { type: 'string' },
                categorySubtitle: { type: 'string' },
                reviewsCount: { type: 'number' },
                reviewsCountLabel: { type: 'string' },
                appSize: { type: 'number' },
                appSizeLabel: { type: 'string' },
                installCount: { type: 'number' },
                installCountLabel: { type: 'string' },
                ageLimit: { type: 'number' },
                ageLimitLabel: { type: 'string' },
                icon: {
                    type: 'string',
                    format: 'binary',
                },
                gallery: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @ApiOperation({ summary: 'Updates an existing PWA application with images.' })
    async updateApp(
        @Param('id') id: string,
        @Req() req: any
    ) {
        if (!req.isMultipart()) {
            return this.client.updateApp(id, req.body, buildGrpcMetadata(req));
        }

        const data = await this.parseMultipart(req);
        const finalDto = this.formatDto(data.dto, data.galleryUrls);

        return this.client.updateApp(id, finalDto, buildGrpcMetadata(req));
    }

    private async parseMultipart(req: any) {
        const parts = req.parts();
        const dto: any = {};
        const galleryUrls: string[] = [];
        const protocol = req.protocol || 'http';
        const host = req.headers.host;

        for await (const part of parts) {
            if (part.file) {
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname(part.filename)}`;
                const filePath = join(this.uploadDir, fileName);
                await pump(part.file, createWriteStream(filePath));

                const url = `${protocol}://${host}/uploads/${fileName}`;

                if (part.fieldname === 'icon') {
                    dto.iconUrl = url;
                } else if (part.fieldname === 'gallery') {
                    galleryUrls.push(url);
                }
            } else {
                dto[part.fieldname] = part.value;
            }
        }
        return { dto, galleryUrls };
    }

    private formatDto(dto: any, galleryUrls: string[]): any {
        const numericFields = ['reviewsCount', 'appSize', 'installCount', 'ageLimit'];

        // ВАЖЛИВО: Забрали звідси 'events', залишили тільки об'єктні масиви!
        const jsonFields = ['comments', 'terms', 'tags'];

        if (galleryUrls.length > 0) {
            dto.galleryUrls = galleryUrls;
        }

        // 1. Обробка числових полів
        for (const field of numericFields) {
            if (dto[field] !== undefined) {
                dto[field] = Number(dto[field]) || 0;
            }
        }

        // 2. Обробка JSON-полів (tags, terms, comments)
        for (const field of jsonFields) {
            if (typeof dto[field] === 'string') {
                try {
                    dto[field] = JSON.parse(dto[field]);
                } catch (e: any) {
                    console.log(`Помилка парсингу JSON для ${field}:`, e.message);
                    dto[field] = []; // Якщо прийшло сміття, ставимо пустий масив
                }
            }
        }

        // 3. ОКРЕМА ОБРОБКА ДЛЯ EVENTS (бо він приходить через кому)
        if (typeof dto.events === 'string') {
            // Якщо раптом прийшов валідний JSON '["dep", "reg"]'
            if (dto.events.startsWith('[') && dto.events.endsWith(']')) {
                try {
                    dto.events = JSON.parse(dto.events);
                } catch (e) {
                    dto.events = [];
                }
            } else {
                // Твій поточний випадок: 'dep,reg,sub,redep'
                // Розбиваємо по комі, прибираємо пробіли по краях і фільтруємо пусті
                dto.events = dto.events.split(',').map((e: string) => e.trim()).filter(Boolean);
            }
        } else if (!dto.events) {
            dto.events = [];
        }

        // Якщо масив івентів порожній (не передали), ставимо дефолтні
        if (dto.events.length === 0) {
            dto.events = ['reg', 'dep', 'sub', 'redep'];
        }

        return dto;
    }

    @Get('app/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Retrieves PWA application details by ID.' })
    async getAppById(@Param('id') id: string, @Req() req: any) {
        return this.client.getAppById(id, buildGrpcMetadata(req));
    }

    @Get('apps')
    @HttpCode(200)
    @ApiOperation({ summary: 'Retrieves a list of PWA applications with pagination.' })
    async findAll(@Body() pagination: PaginationQueryDto, @Req() req: any) {
        return this.client.findAll(pagination, buildGrpcMetadata(req));
    }

    @Delete('app/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Deletes a PWA application.' })
    async deleteApp(@Param('id') id: string, @Req() req: any) {
        return this.client.deleteApp(id, buildGrpcMetadata(req));
    }
}