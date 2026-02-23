import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom, Observable } from 'rxjs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import {
    CreateAppDto,
    UpdateAppDto,
    PaginationQueryDto,
    PwaAppFiltersQueryDto
} from '../../../../pwa-shared/src';

const pump = promisify(pipeline);

interface PwaAppsManagerService {
    CreateApp(data: CreateAppDto, md?: Metadata): Observable<any>;
    FindOne(data: { app_id: string }, md?: Metadata): Observable<any>;
    FindAll(data: { pagination: PaginationQueryDto; filters?: PwaAppFiltersQueryDto }, md?: Metadata): Observable<any>;
    UpdateApp(data: UpdateAppDto & { id: string }, md?: Metadata): Observable<any>;
    DeleteApp(data: { id: string }, md?: Metadata): Observable<any>;
}

@Injectable()
export class PwaManagerGrpcClient implements OnModuleInit {
    private svc!: PwaAppsManagerService;
    private readonly uploadDir = join(process.cwd(), 'uploads');

    constructor(@Inject('APPS_MANAGER_GRPC') private client: ClientGrpc) {
        if (!existsSync(this.uploadDir)) {
            mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    onModuleInit() {
        this.svc = this.client.getService<PwaAppsManagerService>('PwaAppsManagerService');
    }

    async parseMultipart(req: any) {
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

    formatDto(dto: any, galleryUrls: string[]): any {
        const numericFields = ['reviewsCount', 'appSize', 'installCount', 'ageLimit'];
        const jsonFields = ['comments', 'terms', 'tags'];

        if (galleryUrls.length > 0) {
            dto.galleryUrls = galleryUrls;
        }

        for (const field of numericFields) {
            if (dto[field] !== undefined) {
                dto[field] = Number(dto[field]) || 0;
            }
        }

        for (const field of jsonFields) {
            if (typeof dto[field] === 'string') {
                try {
                    dto[field] = JSON.parse(dto[field]);
                } catch (e: any) {
                    console.log(`Помилка парсингу JSON для ${field}:`, e.message);
                    dto[field] = [];
                }
            }
        }

        if (typeof dto.events === 'string') {
            if (dto.events.startsWith('[') && dto.events.endsWith(']')) {
                try {
                    dto.events = JSON.parse(dto.events);
                } catch (e) {
                    dto.events = [];
                }
            } else {
                dto.events = dto.events.split(',').map((e: string) => e.trim()).filter(Boolean);
            }
        } else if (!dto.events) {
            dto.events = [];
        }

        if (dto.events.length === 0) {
            dto.events = ['reg', 'dep', 'sub', 'redep'];
        }

        return dto;
    }

    async createApp(dto: CreateAppDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.CreateApp(dto, metadata));
    }

    async findOne(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.FindOne({ app_id: id }, metadata));
    }

    async findAll(pagination: PaginationQueryDto, filters?: PwaAppFiltersQueryDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.FindAll({ pagination, filters }, metadata));
    }

    async updateApp(id: string, dto: UpdateAppDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.UpdateApp({ id, ...dto }, metadata));
    }

    async deleteApp(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.DeleteApp({ id }, metadata));
    }
}