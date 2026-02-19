import { Injectable } from '@nestjs/common';
import { Prisma, PrismaService } from "../../../pwa-prisma/src";
import {
    CreatePixelTokenDto, PaginationQueryDto, PixelTokenFiltersQueryDto, UpdatePixelTokenDto
} from "../../../pwa-shared/src";

@Injectable()
export class PixelTokenRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreatePixelTokenDto) {
        return this.prisma.pixelToken.create({ data });
    }

    async findAll(pagination: PaginationQueryDto, filters: PixelTokenFiltersQueryDto, userId?: string) {
        const { limit = 10, offset = 0 } = pagination;
        const take = Number(limit);
        const skip = Number(offset);

        const where: Prisma.PixelTokenWhereInput = {};
        if (userId) {
            where.ownerId = userId;
        }

        if (filters.ownerUsername) {
            where.owner = {
                username: { contains: filters.ownerUsername, mode: 'insensitive' }
            };
        }

        if (filters.search) {
            where.OR = [
                { token: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                {
                    owner: {
                        username: { contains: filters.search, mode: 'insensitive' }
                    }
                }
            ];
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.pixelToken.findMany({
                where,
                take,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: {
                        select: { username: true, email: true }
                    }
                }
            }),
            this.prisma.pixelToken.count({ where }),
        ]);

        return { items, total };
    }

    async findOne(id: string) {
        return this.prisma.pixelToken.findUnique({
            where: { id }
        });
    }
    async findOneByToken(token: string) {
        return this.prisma.pixelToken.findUnique({
            where: { token }
        });
    }

    async update(data: UpdatePixelTokenDto) {
        const id = data.id
        delete data.id;
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