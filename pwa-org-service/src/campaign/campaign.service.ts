import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CampaignRepository } from './campaign.repository';
import { CreateCampaignDto, PaginationQueryDto, UpdateCampaignDto } from "../../../pwa-shared/src";
import { RoleFilterQueryDto } from "../../../pwa-shared/src/types/org/roles/dto/filters-query.dto";
import { RoleService } from "../roles/role.service";
import { SharingService } from "../sharing/sharing.service";
import { ScopeType } from "../../../pwa-shared/src/types/org/roles/enums/scope.enum";
import { SystemRoleName } from "../../../pwa-shared/src/types/org/roles/enums/role.enums";
import { AccessLevel } from '../../../pwa-shared/src/types/org/sharing/enums/access.enum';

@Injectable()
export class CampaignService {
    private readonly logger = new Logger(CampaignService.name);

    constructor(
        private readonly repo: CampaignRepository,
        private readonly roleService: RoleService,
        private readonly sharingService: SharingService,
    ) {}

    async create(dto: CreateCampaignDto, userId: string) {
        const campaign = await this.repo.create(dto);
        const woLink = await this.repo.findWorkingObjectLink(campaign.id);

        if (!woLink) {
            this.logger.error(`Working Object for campaign ${campaign.id} not found`);
        }

        this.logger.log(`Campaign created: ${campaign.id}. Initializing roles...`);

        const ownerRole = await this.roleService.create(
            {
                name: SystemRoleName.CAMPAIGN_OWNER,
                description: 'Full access to all campaign resources',
                globalRules: {
                    statAccess: AccessLevel.Manage,
                    finAccess: AccessLevel.Manage,
                    logAccess: AccessLevel.Manage,
                    usersAccess: AccessLevel.Manage,
                    sharingAccess: true
                }
            },
            ScopeType.CAMPAIGN,
            campaign.id
        );

        await this.roleService.assignRoleToUser(
            {
                userId: userId,
                roleId: parseInt(ownerRole.id),
            },
            ScopeType.SYSTEM
        );

        if (woLink) {
            const shareProfile = await this.repo.createFullCrudProfile(campaign.id);
            await this.sharingService.shareWithRole({
                workingObjectId: woLink.workingObjectId,
                roleId: parseInt(ownerRole.id),
                accessProfileId: shareProfile.id,
            });

            this.logger.log(`Campaign WO shared with Role Owner`);
        }

        await this.roleService.create(
            {
                name: SystemRoleName.TEAM_LEAD,
                description: 'Operational Manager',
                globalRules: {
                    statAccess: AccessLevel.View,
                    finAccess: AccessLevel.None,
                    logAccess: AccessLevel.View,
                    usersAccess: AccessLevel.Manage,
                    sharingAccess: true
                }
            },
            ScopeType.CAMPAIGN,
            campaign.id
        );

        await this.roleService.create(
            {
                name: SystemRoleName.MEDIA_BUYER,
                description: 'Standard Media Buyer',
                globalRules: {
                    statAccess: AccessLevel.View,
                    finAccess: AccessLevel.None,
                    logAccess: AccessLevel.None,
                    usersAccess: AccessLevel.None,
                    sharingAccess: false
                }
            },
            ScopeType.CAMPAIGN,
            campaign.id
        );

        return campaign;
    }

    async findOne(id: string) {
        return await this.repo.findOne(id);
    }

    async findAll(pagination?: PaginationQueryDto, filters?: RoleFilterQueryDto) {
        const { items, total } = await this.repo.findAll(pagination, filters);
        return {
            campaigns: items,
            total,
        };
    }

    async update(data: UpdateCampaignDto) {
        return await this.repo.update(data);
    }

    async delete(id: string) {
        return await this.repo.delete(id);
    }

    async addMember(userId: string, campaignId: string, roleId: number) {
        return this.repo.addMember(userId, campaignId, roleId);
    }
}