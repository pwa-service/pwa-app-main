import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { RoleGrpcClient } from './role.grpc.client';
import {
    CreateRoleDto,
    PaginationQueryDto,
    UpdateRoleDto
} from "../../../../pwa-shared/src";
import { RoleFilterQueryDto } from "../../../../pwa-shared/src/types/org/roles/dto/filters-query.dto";
import { AssignRoleDto } from "../../../../pwa-shared/src/types/org/roles/dto/assign-role.dto";

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleHttpController {
    constructor(private readonly client: RoleGrpcClient) {}

    @Post()
    @ApiOperation({ summary: 'Create a new role' })
    async create(@Body() dto: CreateRoleDto) {
        return this.client.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List roles' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: RoleFilterQueryDto
    ) {
        return this.client.findAll(pagination, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get role details' })
    async findOne(@Param('id') id: string) {
        return this.client.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update role' })
    async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.client.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete role' })
    async delete(@Param('id') id: string) {
        return this.client.delete(id);
    }

    @Post('assign')
    @ApiOperation({ summary: 'Assign role to user' })
    async assign(@Body() dto: AssignRoleDto) {
        return this.client.assign(dto);
    }
}