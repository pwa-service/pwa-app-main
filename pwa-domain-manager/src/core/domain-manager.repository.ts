import { Injectable } from '@nestjs/common';
import { PrismaService, Prisma, Domain } from '../../../pwa-prisma/src';

@Injectable()
export class DomainManagerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.DomainCreateInput): Promise<Domain> {
        return this.prisma.domain.create({ data });
    }

    async findAll(params: {
        where: Prisma.DomainWhereInput;
        skip: number;
        take: number;
    }) {
        const { where, skip, take } = params;

        const [items, total] = await Promise.all([
            this.prisma.domain.findMany({
                where,
                take,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    pwaApp: {
                        select: { id: true, name: true }
                    }
                }
            }),
            this.prisma.domain.count({ where })
        ]);
        return { items, total };
    }

    async findOne(id: string): Promise<Domain | null> {
        return this.prisma.domain.findUnique({
            where: { id },
            include: { pwaApp: true }
        });
    }

    async update(id: string, data: Prisma.DomainUpdateInput): Promise<Domain> {
        return this.prisma.domain.update({
            where: { id },
            data
        });
    }

    async remove(id: string): Promise<Domain> {
        return this.prisma.domain.delete({
            where: { id }
        });
    }
}