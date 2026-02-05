import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { TeamGrpcClient } from './team.grpc.client';
import {
    AddMemberDto,
    AssignLeadDto,
    CreateTeamDto,
    PaginationQueryDto,
    RemoveMemberDto,
    UpdateTeamDto
} from "../../../../pwa-shared/src";
import {TeamFilterQueryDto} from "../../../../pwa-shared/src/types/org/team/dto/filter-query.dto";

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamHttpController {
    constructor(private readonly client: TeamGrpcClient) {}

    @Post()
    @ApiOperation({ summary: 'Create a new team' })
    async create(@Body() dto: CreateTeamDto) {
        return this.client.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List visible teams' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: TeamFilterQueryDto
    ) {
        return this.client.findAll(pagination, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get team details' })
    async findOne(@Param('id') id: string) {
        return this.client.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update team details' })
    async update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
        return this.client.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete team' })
    async delete(@Param('id') id: string) {
        return this.client.delete(id);
    }


    @Post('members')
    @ApiOperation({ summary: 'Add a member to the team' })
    async addMember(@Body() dto: AddMemberDto) {
        return this.client.addMember(dto);
    }

    @Post('members/remove')
    @ApiOperation({ summary: 'Remove a member from the team' })
    async removeMember(@Body() dto: RemoveMemberDto) {
        return this.client.removeMember(dto);
    }

    @Post('lead')
    @ApiOperation({ summary: 'Assign or change Team Lead' })
    async assignTeamLead(@Body() dto: AssignLeadDto) {
        return this.client.assignTeamLead(dto);
    }
}