import { Body, Controller, HttpCode, Post, Get, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GeneratorGrpcClient } from './generator.grpc.client';
import { buildGrpcMetadata } from '../common/jwt-to-metadata';
import { CreateAppDto } from '../../../pwa-shared/src';

@Controller('generator')
@ApiTags('Generator')
export class GeneratorHttpController {
    constructor(private readonly generator: GeneratorGrpcClient) {}

    @Post('app')
    @HttpCode(200)
    @ApiOperation({ summary: 'Creates a new PWA application record.' })
    async createApp(@Body() dto: CreateAppDto, @Req() req: Request) {
        return this.generator.createApp(dto, buildGrpcMetadata(req));
    }

    @Get('app/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Retrieves PWA application details by ID.' })
    async getAppById(@Param('id') id: string, @Req() req: Request) {
        return this.generator.getAppById(id, buildGrpcMetadata(req));
    }
}