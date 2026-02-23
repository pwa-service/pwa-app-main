import {
    Body, Controller, Delete, Get, HttpCode,
    Param, Patch, Post, Req, UseGuards, Query
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PixelTokenGrpcClient } from './pixel-token.grpc.client';
import { buildGrpcMetadata } from "../../common/jwt-to-metadata";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import {
    PixelTokenFiltersQueryDto,
    UpdatePixelTokenDto,
    PaginationQueryDto
} from "../../../../pwa-shared/src";

@ApiTags('Pixel Tokens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pixel-token')
export class PixelTokenHttpController {
    constructor(private readonly client: PixelTokenGrpcClient) { }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new pixel token' })
    async create(@Body() dto: any, @Req() req: Request) {
        return this.client.create(dto, buildGrpcMetadata(req));
    }

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Get all pixel tokens' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: PixelTokenFiltersQueryDto,
        @Req() req: Request
    ) {
        return this.client.findAll(pagination, filters, buildGrpcMetadata(req));
    }

    @Get(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get a pixel token by ID' })
    async findOne(@Param('id') id: string, @Req() req: Request) {
        return this.client.findOne(id, buildGrpcMetadata(req));
    }

    @Patch(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Update a pixel token' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdatePixelTokenDto,
        @Req() req: Request
    ) {
        return this.client.update(id, dto, buildGrpcMetadata(req));
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a pixel token' })
    async remove(@Param('id') id: string, @Req() req: Request) {
        return this.client.remove(id, buildGrpcMetadata(req));
    }
}