import { Injectable } from '@nestjs/common';
import { User, Status } from '@prisma/client';
import { PrismaService } from "../../../pwa-prisma/src";

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
                status: Status.active,
            },
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
        name: string;
    }): Promise<User> {
        return this.prisma.user.create({ data });
    }
}