import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { SharingGrpcClient } from './sharing.grpc.client';
import {
    ShareWithRoleDto,
    ShareWithUserDto,
    RevokeShareDto
} from "../../../../pwa-shared/src";

@ApiTags('Sharing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sharing')
export class SharingHttpController {
    constructor(private readonly client: SharingGrpcClient) {}

    @Post('role')
    @ApiOperation({ summary: 'Share a working object with a specific role' })
    async shareWithRole(@Body() dto: ShareWithRoleDto) {
        return this.client.shareWithRole(dto);
    }

    @Post('user')
    @ApiOperation({ summary: 'Share a working object with a specific user' })
    async shareWithUser(@Body() dto: ShareWithUserDto) {
        return this.client.shareWithUser(dto);
    }

    @Get('list')
    @ApiOperation({ summary: 'Get all active shares for a working object' })
    async getObjectShares(@Query('workingObjectId') workingObjectId: string) {
        return this.client.getObjectShares(workingObjectId);
    }

    @Post('revoke')
    @ApiOperation({ summary: 'Revoke access (Role or User share)' })
    async revokeShare(@Body() dto: RevokeShareDto) {
        return this.client.revokeShare(dto);
    }
}