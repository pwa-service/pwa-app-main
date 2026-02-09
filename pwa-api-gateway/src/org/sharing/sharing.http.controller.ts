import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { SharingGrpcClient } from './sharing.grpc.client';
import {
    ShareWithRoleDto,
    ShareWithUserDto,
    RevokeShareDto
} from "../../../../pwa-shared/src";
import {buildGrpcMetadata} from "../../common/jwt-to-metadata";

@ApiTags('Sharing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sharing')
export class SharingHttpController {
    constructor(private readonly client: SharingGrpcClient) {}

    @Post('role')
    @ApiOperation({ summary: 'Share a working object with a specific role' })
    async shareWithRole(@Body() dto: ShareWithRoleDto, @Req() req: any) {
        return this.client.shareWithRole(dto, buildGrpcMetadata(req));
    }

    @Post('user')
    @ApiOperation({ summary: 'Share a working object with a specific user' })
    async shareWithUser(@Body() dto: ShareWithUserDto, @Req() req: any) {
        return this.client.shareWithUser(dto, buildGrpcMetadata(req));
    }

    @Get('list')
    @ApiOperation({ summary: 'Get all active shares for a working object' })
    async getObjectShares(@Query('workingObjectId') workingObjectId: string, @Req() req: any) {
        return this.client.getObjectShares(workingObjectId, buildGrpcMetadata(req));
    }

    @Post('revoke')
    @ApiOperation({ summary: 'Revoke access (Role or User share)' })
    async revokeShare(@Body() dto: RevokeShareDto, @Req() req: any) {
        return this.client.revokeShare(dto, buildGrpcMetadata(req));
    }
}