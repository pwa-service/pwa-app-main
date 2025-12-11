import { Injectable } from '@nestjs/common';
import { User, Status } from '@prisma/client';
import { PrismaService } from '../../../pwa-prisma/src';

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async createUser(data: {
        username: string;
        email?: string;
        password: string;
    }): Promise<User> {
        const user = {...data, status: Status.inactive}
        return this.prisma.user.create({ data: user });
    }

    async updatePassword(userId: string, passwordHash: string): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: { password: passwordHash },
        });
    }

    async markEmailConfirmed(userId: string): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: Status.active },
        });
    }
}