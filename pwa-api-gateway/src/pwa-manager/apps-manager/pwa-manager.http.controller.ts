import { Body, Controller, HttpCode, Post, Get, Put, Delete, Req, Param, Query } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PwaManagerGrpcClient } from './pwa-manager.grpc.client';
import { buildGrpcMetadata } from '../../common/jwt-to-metadata';
import {
    CreateAppDto,
    UpdateAppDto,
    PaginationQueryDto
} from '../../../../pwa-shared/src';

@Controller('pwa-apps-manager')
@ApiTags('Apps Manager')
export class PwaManagerHttpController {
    constructor(private readonly client: PwaManagerGrpcClient) { }

    @Post('app')
    @HttpCode(200)
    @ApiOperation({ summary: 'Creates a new PWA application record.' })
    async createApp(@Body() dto: CreateAppDto, @Req() req: Request) {
        return this.client.createApp(dto, buildGrpcMetadata(req));
    }

    @Get('app/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Retrieves PWA application details by ID.' })
    async getAppById(@Param('id') id: string, @Req() req: Request) {
        return this.client.getAppById(id, buildGrpcMetadata(req));
    }

    @Get('apps')
    @HttpCode(200)
    @ApiOperation({ summary: 'Retrieves a list of PWA applications with pagination.' })
    async findAll(@Body() pagination: PaginationQueryDto, @Req() req: Request) {
        return this.client.findAll(pagination, buildGrpcMetadata(req));
    }

    @Put('app/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Updates an existing PWA application.' })
    async updateApp(
        @Param('id') id: string,
        @Body() dto: UpdateAppDto,
        @Req() req: Request
    ) {
        return this.client.updateApp(id, dto, buildGrpcMetadata(req));
    }

    @Delete('app/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Deletes a PWA application.' })
    async deleteApp(@Param('id') id: string, @Req() req: Request) {
        return this.client.deleteApp(id, buildGrpcMetadata(req));
    }
}