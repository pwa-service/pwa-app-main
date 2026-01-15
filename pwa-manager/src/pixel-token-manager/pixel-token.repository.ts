import { Injectable } from '@nestjs/common';
import { PixelToken } from '@prisma/client';
import {PrismaService} from "../../../pwa-prisma/src";
import {
    CreatePixelTokenDto, UpdatePixelTokenDto
} from "../../../pwa-shared/src/types/pwa-manager/pixel-token-manager/dto/create-pixel-token.dto";

@Injectable()
export class PixelTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreatePixelTokenDto) {
        return this.prisma.pixelToken.create({ data });
    }

    async findAll(userId: string) {
        return this.prisma.pixelToken.findMany({
            orderBy: { createdAt: 'desc' },
            where: {
                ownerId: userId
            }
        });
    }

    async findOne(id: string) {
        return this.prisma.pixelToken.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: Omit<UpdatePixelTokenDto, 'id'>) {
        return this.prisma.pixelToken.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return this.prisma.pixelToken.delete({
            where: { id }
        });
    }
}