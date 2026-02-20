import { Body, Controller, HttpCode, Post, Get, Put, Delete, Req, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PwaManagerGrpcClient } from './pwa-manager.grpc.client';
import { buildGrpcMetadata } from '../../common/jwt-to-metadata';
import {
    CreateAppDto,
    UpdateAppDto,
    PaginationQueryDto
} from '../../../../pwa-shared/src';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';

const pump = promisify(pipeline);

@Controller('pwa-apps-manager')
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

        for await (const part of parts) {
            if (part.file) {
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname(part.filename)}`;
                const filePath = join(this.uploadDir, fileName);
                await pump(part.file, createWriteStream(filePath));
                const url = `/uploads/${fileName}`;

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
        const jsonFields = ['comments', 'terms', 'tags', 'events'];

        if (galleryUrls.length > 0) {
            dto.galleryUrls = galleryUrls;
        }

        for (const field of numericFields) {
            if (dto[field] !== undefined) {
                dto[field] = Number(dto[field]);
            }
        }

        for (const field of jsonFields) {
            if (typeof dto[field] === 'string') {
                try {
                    dto[field] = JSON.parse(dto[field]);
                } catch (e) {
                    console.log(e);
                }
            }
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