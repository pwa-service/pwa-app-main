import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {CreateDomainDto, DomainFilterQueryDto} from "../../../pwa-shared/src";
import {DomainGrpcClient} from "./domain-manager.grpc.client";
import {buildGrpcMetadata} from "../common/jwt-to-metadata";
import {PaginationQueryDto} from "../../../pwa-shared/src";

@ApiTags('Domains')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('domains')
export class DomainHttpController {
    constructor(private readonly client: DomainGrpcClient) {}

    @Post()
    @ApiOperation({ summary: 'Create new domain' })
    async create(@Body() dto: CreateDomainDto, @Req() req: any) {
        return this.client.create(dto, buildGrpcMetadata(req));
    }

    @Get()
    @ApiOperation({ summary: 'Get list of domains' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: DomainFilterQueryDto,
        @Req() req: any
    ) {
        return await this.client.findAll(pagination, filters, buildGrpcMetadata(req));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get domain by ID' })
    async findOne(@Param('id') id: string, @Req() req: any) {
        return await this.client.findOne(id, buildGrpcMetadata(req));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update domain' })
    async update(
        @Param('id') id: string,
        @Body() dto: any,
        @Req() req: any
    ) {
        return await this.client.update(id, dto, buildGrpcMetadata(req));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete domain' })
    async remove(@Param('id') id: string, @Req() req: any) {
        return await this.client.remove(id, buildGrpcMetadata(req));
    }
}