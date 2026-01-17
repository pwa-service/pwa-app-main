import { Injectable } from '@nestjs/common';
import { Status, User } from '@prisma/client';
import { PrismaService } from '../../../pwa-prisma/src/prisma.service';


@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: { email },
        });
    }

    async findByIUsername(username: string | undefined | null) {
        if (!username) {
            return null;
        }

        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async createUser(data: {
        username: string;
        email?: string;
        passwordHash: string;
    }) {
        const user = {...data, status: Status.inactive}
        return this.prisma.user.create({ data: user });
    }

    async updatePassword(userId: string, passwordHash: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    }

    async markEmailConfirmed(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: Status.active },
        });
    }
}