import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from '../../../pwa-prisma/src/prisma.service';
import {CreateUserDto} from "../common/types/dto/create-user.dto";

const userIncludes = {
    GlobalAccessUser: {
        include: {
            accessProfile: {
                include: {
                    globalRules: true
                }
            }
        }
    },
    systemUser: {
        include: {
            role: {
                include: {
                    accessProfile: {
                        include: {
                            accessProfile: {
                                include: { globalRules: true }
                            }
                        }
                    }
                }
            }
        }
    },
    campaignUser: {
        include: {
            role: {
                include: {
                    accessProfile: {
                        include: {
                            accessProfile: {
                                include: { globalRules: true }
                            }
                        }
                    }
                }
            }
        }
    },
    teamUser: {
        include: {
            role: {
                include: {
                    accessProfile: {
                        include: {
                            accessProfile: {
                                include: { globalRules: true }
                            }
                        }
                    }
                }
            }
        }
    }
};

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.userProfile.findFirst({
            where: { email },
            include: userIncludes
        });
    }

    async findByUsername(username: string | undefined | null) {
        if (!username) return null;
        return this.prisma.userProfile.findUnique({
            where: { username },
            include: userIncludes
        });
    }

    async findById(id: string) {
        return this.prisma.userProfile.findUnique({
            where: { id },
            include: userIncludes
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