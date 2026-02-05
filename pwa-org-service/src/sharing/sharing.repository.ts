import { Injectable } from '@nestjs/common';
import { Prisma, ShareRole, ShareUserProfile, PrismaService } from "../../../pwa-prisma/src";


export type RoleShareWithRelations = Prisma.ShareRoleGetPayload<{
    include: { role: true; accessProfile: true }
}>;

export type UserShareWithRelations = Prisma.ShareUserProfileGetPayload<{
    include: { userProfile: true; accessProfile: true }
}>;

export interface ObjectSharesResult {
    roleShares: RoleShareWithRelations[];
    userShares: UserShareWithRelations[];
}


@Injectable()
export class SharingRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getAccessProfile(id: string) {
        return this.prisma.accessProfile.findUnique({ where: { id } });
    }

    async createRoleShare(data: Prisma.ShareRoleUncheckedCreateInput): Promise<ShareRole> {
        return this.prisma.shareRole.create({ data });
    }

    async findRoleShare(workingObjectId: string, roleId: number, accessProfileId: string) {
        return this.prisma.shareRole.findUnique({
            where: {
                roleId_workingObjectId_accessProfileId: { workingObjectId, roleId, accessProfileId }
            },
        });
    }

    async deleteRoleShare(id: string) {
        return this.prisma.shareRole.delete({ where: { id } });
    }

    async createUserShare(data: Prisma.ShareUserProfileUncheckedCreateInput): Promise<ShareUserProfile> {
        return this.prisma.shareUserProfile.create({ data });
    }

    async findUserShare(workingObjectId: string, userProfileId: string, accessProfileId: string) {
        return this.prisma.shareUserProfile.findUnique({
            where: {
                userProfileId_workingObjectId_accessProfileId: { workingObjectId, userProfileId, accessProfileId }
            },
        });
    }

    async deleteUserShare(id: string) {
        return this.prisma.shareUserProfile.delete({ where: { id } });
    }

    async getAllSharesForObject(workingObjectId: string): Promise<ObjectSharesResult> {
        const [roleShares, userShares] = await Promise.all([
            this.prisma.shareRole.findMany({
                where: { workingObjectId },
                include: { role: true, accessProfile: true }
            }),
            this.prisma.shareUserProfile.findMany({
                where: { workingObjectId },
                include: { userProfile: true, accessProfile: true }
            }),
        ]);

        return { roleShares, userShares };
    }
}