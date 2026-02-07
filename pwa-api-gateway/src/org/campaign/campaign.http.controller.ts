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
            ownerId: req.user.id
        });
    }

    @Get()
    @ApiOperation({ summary: 'List campaigns' })
    async findAll(
        @Query() pagination: PaginationQueryDto,
        @Query() filters: CampaignFiltersQueryDto
    ) {
        return this.client.findAll(pagination, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get campaign details' })
    async findOne(@Param('id') id: string) {
        return this.client.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update campaign' })
    async update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
        return this.client.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete campaign' })
    async delete(@Param('id') id: string) {
        return this.client.delete(id);
    }
}