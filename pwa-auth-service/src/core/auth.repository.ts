import { Injectable } from '@nestjs/common';
import { Status, ScopeType, Prisma } from '@prisma/client';
import { PrismaService } from '../../../pwa-prisma/src/prisma.service';
import {CreateUserDto} from "../common/types/dto/create-user.dto";

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.userProfile.findFirst({
            where: { email },
            include: {
                systemUser: { include: { role: true } },
                campaignUser: { include: { role: true } },
                teamUser: { include: { role: true } }
            }
        });
    }

    async findByUsername(username: string | undefined | null) {
        if (!username) return null;

        return this.prisma.userProfile.findUnique({
            where: { username },
            include: {
                systemUser: { include: { role: true } },
                campaignUser: { include: { role: true } },
                teamUser: { include: { role: true } }
            }
        });
    }

    async findById(id: string) {
        return this.prisma.userProfile.findUnique({
            where: { id },
            include: {
                systemUser: { include: { role: true } },
                campaignUser: { include: { role: true } },
                teamUser: { include: { role: true } }
            }
        });
    }


    async createBaseProfile(data: CreateUserDto) {
        return this.prisma.userProfile.create({
            data: {
                ...data,
                status: Status.inactive
            }
        });
    }


    async updatePassword(userProfileId: string, passwordHash: string) {
        return this.prisma.userProfile.update({
            where: { id: userProfileId },
            data: { passwordHash },
        });
    }

    async markEmailConfirmed(userProfileId: string) {
        return this.prisma.userProfile.update({
            where: { id: userProfileId },
            data: { status: Status.active },
        });
    }
}