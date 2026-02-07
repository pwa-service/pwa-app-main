import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CampaignGrpcClient } from './campaign.grpc.client';
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import {
    CreateCampaignDto,
    PaginationQueryDto,
    UpdateCampaignDto,
    CampaignFiltersQueryDto
} from "../../../../pwa-shared/src";
import { buildGrpcMetadata } from "../../common/jwt-to-metadata"; // Перевірте шлях

@ApiTags('Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignHttpController {
    constructor(private readonly client: CampaignGrpcClient) {}

    @Post()
    @ApiOperation({ summary: 'Create new campaign' })
    async create(@Body() dto: CreateCampaignDto, @Req() req: any) {
        return this.client.create({
            ...dto,
            ownerId: req.user?.id
        }, buildGrpcMetadata(req));
    }

    @Get()
    @ApiOperation({ summary: 'List campaigns' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: CampaignFiltersQueryDto,
        @Req() req: any
    ) {
        return this.client.findAll(pagination, filters, buildGrpcMetadata(req));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get campaign details' })
    async findOne(@Param('id') id: string, @Req() req: any) {
        return this.client.findOne(id, buildGrpcMetadata(req));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update campaign' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCampaignDto,
        @Req() req: any
    ) {
        return this.client.update(id, dto, buildGrpcMetadata(req));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete campaign' })
    async delete(@Param('id') id: string, @Req() req: any) {
        return this.client.delete(id, buildGrpcMetadata(req));
    }
}