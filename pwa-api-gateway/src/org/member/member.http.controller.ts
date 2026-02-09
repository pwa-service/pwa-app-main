import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { MemberGrpcClient } from './member.grpc.client';
import { CreateMemberDto } from "../../../../pwa-shared/src";
import { CreateCampaignMemberDto } from "../../../../pwa-shared/src/types/org/member/dto/create-campaign.dto";
import {buildGrpcMetadata} from "../../common/jwt-to-metadata";

@ApiTags('Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('members')
export class MemberHttpController {
    constructor(private readonly client: MemberGrpcClient) {}

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile details' })
    async getMyProfile(@Req() req: any) {
        return this.client.getMyProfile(req.user.id);
    }

    @Get('me/stats')
    @ApiOperation({ summary: 'Get current user statistics' })
    async getMyStats(@Req() req: any) {
        return this.client.getMyStats(req.user.id, buildGrpcMetadata(req));
    }

    @Post('campaign')
    @ApiOperation({ summary: 'Create a new member directly in a campaign' })
    async createCampaignMember(@Body() dto: CreateCampaignMemberDto, @Req() req: any) {
        return this.client.createCampaignMember(dto, buildGrpcMetadata(req));
    }

    @Post('team/lead')
    @ApiOperation({ summary: 'Create a Team Lead (requires Campaign Owner rights)' })
    async createTeamLead(@Body() dto: CreateMemberDto, @Req() req: any) {
        return this.client.createTeamLead(dto, buildGrpcMetadata(req));
    }

    @Post('team/member')
    @ApiOperation({ summary: 'Create a standard Team Member' })
    async createTeamMember(@Body() dto: CreateMemberDto, @Req() req: any) {
        return this.client.createTeamMember(dto, buildGrpcMetadata(req));
    }
}