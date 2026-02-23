import { Body, Controller, HttpCode, Post, Get, Put, Delete, Req, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PwaManagerGrpcClient } from './pwa-manager.grpc.client';
import { buildGrpcMetadata } from '../../common/jwt-to-metadata';
import { PaginationQueryDto, PwaAppStatus, PwaAppFiltersQueryDto } from '../../../../pwa-shared/src';
import { JwtAuthGuard } from 'pwa-api-gateway/src/common/jwt-auth.guard';

@ApiBearerAuth()
@Controller('pwa-apps-manager')
@UseGuards(JwtAuthGuard)
@ApiTags('Apps Manager')
export class PwaManagerHttpController {
    constructor(private readonly client: PwaManagerGrpcClient) { }

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
                icon: { type: 'string', format: 'binary' },
                gallery: { type: 'array', items: { type: 'string', format: 'binary' } },
            },
            required: ['name', 'domainId', 'status', 'lang'],
        },
    })
    @ApiOperation({ summary: 'Creates a new PWA application record with images.' })
    async createApp(@Req() req: any) {
        if (!req.isMultipart()) {
            return this.client.createApp(req.body, buildGrpcMetadata(req));
        }

        const data = await this.client.parseMultipart(req);
        const finalDto = this.client.formatDto(data.dto, data.galleryUrls);

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
                icon: { type: 'string', format: 'binary' },
                gallery: { type: 'array', items: { type: 'string', format: 'binary' } },
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

        const data = await this.client.parseMultipart(req);
        const finalDto = this.client.formatDto(data.dto, data.galleryUrls);

        return this.client.updateApp(id, finalDto, buildGrpcMetadata(req));
    }

    @Get('app/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Retrieves PWA application details by ID.' })
    async findOne(@Param('id') id: string, @Req() req: any) {
        return this.client.findOne(id, buildGrpcMetadata(req));
    }

    @Get('apps')
    @HttpCode(200)
    @ApiOperation({ summary: 'Retrieves a list of PWA applications with pagination and filters.' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: PwaAppFiltersQueryDto,
        @Req() req: any
    ) {
        return this.client.findAll(pagination, filters, buildGrpcMetadata(req));
    }

    @Delete('app/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Deletes a PWA application.' })
    async deleteApp(@Param('id') id: string, @Req() req: any) {
        return this.client.deleteApp(id, buildGrpcMetadata(req));
    }
}