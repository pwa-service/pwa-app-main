import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { SharingRepository } from './sharing.repository';
import {
    ShareWithRoleDto,
    ShareWithUserDto,
    ShareType
} from '../../../pwa-shared/src';

@Injectable()
export class SharingService {
    constructor(private readonly repo: SharingRepository) {}

    async shareWithRole(dto: ShareWithRoleDto) {
        const accessProfile = await this.repo.getAccessProfile(dto.accessProfileId);
        if (!accessProfile) throw new NotFoundException('Access Profile not found');

        const existing = await this.repo.findRoleShare(dto.workingObjectId, dto.roleId, dto.accessProfileId);
        if (existing) throw new ConflictException('Role already has this access profile for this object');

        if (!dto.createdByCampaignUserId && !dto.createdByTeamUserId) {
            throw new BadRequestException('Creator must be specified');
        }

        const share = await this.repo.createRoleShare({
            workingObjectId: dto.workingObjectId,
            roleId: dto.roleId,
            accessProfileId: dto.accessProfileId,
            createdByCampaignUserId: dto.createdByCampaignUserId || null,
            createdByTeamUserId: dto.createdByTeamUserId || null,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        });

        return { success: true, shareId: share.id };
    }

    async shareWithUser(dto: ShareWithUserDto) {
        const accessProfile = await this.repo.getAccessProfile(dto.accessProfileId);
        if (!accessProfile) throw new NotFoundException('Access Profile not found');

        const existing = await this.repo.findUserShare(dto.workingObjectId, dto.targetUserProfileId, dto.accessProfileId);
        if (existing) throw new ConflictException('User already has this access profile for this object');

        const share = await this.repo.createUserShare({
            workingObjectId: dto.workingObjectId,
            userProfileId: dto.targetUserProfileId,
            accessProfileId: dto.accessProfileId,
            createdBy: dto.createdByUserProfileId,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        });

        return { success: true, shareId: share.id };
    }

    async getObjectShares(workingObjectId: string) {
        const { roleShares, userShares } = await this.repo.getAllSharesForObject(workingObjectId);

        const mappedRoles = roleShares.map(s => ({
            id: s.id,
            type: ShareType.ROLE,
            target_id: s.roleId.toString(),
            target_name: s.role.name,
            access_profile_name: s.accessProfile.name,
        }));

        const mappedUsers = userShares.map(s => ({
            id: s.id,
            type: ShareType.USER,
            target_id: s.userProfileId,
            target_name: s.userProfile.username,
            access_profile_name: s.accessProfile.name,
        }));

        return { shares: [...mappedRoles, ...mappedUsers] };
    }

    async revokeShare(shareId: string, type: ShareType) {
        if (type === ShareType.ROLE) {
            await this.repo.deleteRoleShare(shareId);
        } else {
            await this.repo.deleteUserShare(shareId);
        }
        return { success: true, shareId };
    }
}