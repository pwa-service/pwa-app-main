import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
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
import {buildGrpcMetadata} from "../../common/jwt-to-metadata";

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamHttpController {
    constructor(private readonly client: TeamGrpcClient) {}

    @Post()
    @ApiOperation({ summary: 'Create a new team' })
    async create(@Body() dto: CreateTeamDto, @Req() req: any) {
        return this.client.create(dto, buildGrpcMetadata(req));
    }

    @Get()
    @ApiOperation({ summary: 'List visible teams' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: TeamFilterQueryDto,
        @Req() req: any
    ) {
        return this.client.findAll(pagination, filters, buildGrpcMetadata(req));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get team details' })
    async findOne(@Param('id') id: string, @Req() req: any) {
        return this.client.findOne(id, buildGrpcMetadata(req));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update team details' })
    async update(@Param('id') id: string, @Body() dto: UpdateTeamDto, @Req() req: any) {
        return this.client.update(id, dto, buildGrpcMetadata(req));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete team' })
    async delete(@Param('id') id: string, @Req() req: any) {
        return this.client.delete(id, buildGrpcMetadata(req));
    }


    @Post('members')
    @ApiOperation({ summary: 'Add a member to the team' })
    async addMember(@Body() dto: AddMemberDto, @Req() req: any) {
        return this.client.addMember(dto, buildGrpcMetadata(req));
    }

    @Post('members/remove')
    @ApiOperation({ summary: 'Remove a member from the team' })
    async removeMember(@Body() dto: RemoveMemberDto, @Req() req: any) {
        return this.client.removeMember(dto, buildGrpcMetadata(req));
    }

    @Post('lead')
    @ApiOperation({ summary: 'Assign or change Team Lead' })
    async assignTeamLead(@Body() dto: AssignLeadDto, @Req() req: any) {
        return this.client.assignTeamLead(dto, buildGrpcMetadata(req));
    }
}