import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { CampaignRepository } from './campaign.repository';
import { CreateCampaignDto, PaginationQueryDto, UpdateCampaignDto } from "../../../pwa-shared/src";
import { RoleService } from "../roles/role.service";
import { SharingService } from "../sharing/sharing.service";
import { SystemRoleName, RolePriority } from "../../../pwa-shared/src/types/org/roles/enums/role.enums";
import { AccessLevel, RoleFilterQueryDto, ScopeType } from '../../../pwa-shared/src';
import { UserPayload } from '../../../pwa-shared/src/types/auth/dto/user-payload.dto';

@Injectable()
export class CampaignService {
    private readonly logger = new Logger(CampaignService.name);

    constructor(
        private readonly repo: CampaignRepository,
        private readonly roleService: RoleService,
        private readonly sharingService: SharingService,
    ) { }

    async create(dto: CreateCampaignDto, userId: string) {
        dto.ownerId = dto.ownerId || userId;
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
                    sharingAccess: AccessLevel.Manage,
                }
            },
            ScopeType.CAMPAIGN,
            campaign.id,
            RolePriority.OWNER
        );

    

        await this.roleService.assignRoleToUser(
            {
                userId: userId,
                roleId: parseInt(ownerRole.id),
            },
            { scope: ScopeType.SYSTEM } as UserPayload
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
                    sharingAccess: AccessLevel.Manage,
                }
            },
            ScopeType.CAMPAIGN,
            campaign.id,
            RolePriority.LEAD
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
                    sharingAccess: AccessLevel.None,
                }
            },
            ScopeType.CAMPAIGN,
            campaign.id,
            RolePriority.MEMBER
        );

        return campaign;
    }


    async findOne(id: string, user: UserPayload) {
        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== id) {
            throw new ForbiddenException('Access to this campaign is denied');
        }
        return await this.repo.findOne(id);
    }

    async findAll(pagination?: PaginationQueryDto, filters?: RoleFilterQueryDto) {
        const { items, total } = await this.repo.findAll(pagination, filters);
        return {
            campaigns: items,
            total,
        };
    }

    async update(data: UpdateCampaignDto, user: UserPayload) {
        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== data.id) {
            throw new ForbiddenException('Cannot update another campaign');
        }
        return await this.repo.update(data);
    }

    async delete(id: string, user: UserPayload) {
        if (user.scope === ScopeType.CAMPAIGN && user.contextId !== id) {
            throw new ForbiddenException('Cannot delete another campaign');
        }
        return await this.repo.delete(id);
    }

    async addMember(userId: string, campaignId: string, roleId: number) {
        return this.repo.addMember(userId, campaignId, roleId);
    }

    async upsertMember(userId: string, campaignId: string, roleId: number) {
        return this.repo.upsertMember(userId, campaignId, roleId);
    }
}