import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { RoleGrpcClient } from './role.grpc.client';
import {
    CreateRoleDto,
    PaginationQueryDto,
    UpdateRoleDto
} from "../../../../pwa-shared/src";
import { AssignRoleDto, RoleFilterQueryDto } from "../../../../pwa-shared/src";
import {buildGrpcMetadata} from "../../common/jwt-to-metadata";

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleHttpController {
    constructor(private readonly client: RoleGrpcClient) {}

    @Post()
    @ApiOperation({ summary: 'Create a new role' })
    async create(@Body() dto: CreateRoleDto, @Req() req: any) {
        return this.client.create(dto, buildGrpcMetadata(req));
    }

    @Get()
    @ApiOperation({ summary: 'List roles' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: RoleFilterQueryDto,
        @Req() req: any
    ) {
        return this.client.findAll(pagination, filters, buildGrpcMetadata(req));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get role details' })
    async findOne(@Param('id') id: string, @Req() req: any) {
        return this.client.findOne(id, buildGrpcMetadata(req));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update role' })
    async update(@Param('id') id: string, @Body() dto: UpdateRoleDto, @Req() req: any) {
        return this.client.update(id, dto, buildGrpcMetadata(req));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete role' })
    async delete(@Param('id') id: string, @Req() req: any) {
        return this.client.delete(id, buildGrpcMetadata(req));
    }

    @Post('assign')
    @ApiOperation({ summary: 'Assign role to user' })
    async assign(@Body() dto: AssignRoleDto, @Req() req: any) {
        return this.client.assign(dto, buildGrpcMetadata(req));
    }
}