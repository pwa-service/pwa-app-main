import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DomainManagerRepository } from './domain-manager.repository';
import {
    CreateDomainDto,
    UpdateDomainDto,
    DomainFilterQueryDto,
    PaginationQueryDto,
    ScopeType
} from '../../../pwa-shared/src';
import { Prisma } from '../../../pwa-prisma/src';

@Injectable()
export class DomainManagerService {
    constructor(private readonly repository: DomainManagerRepository) {}

    async create(dto: CreateDomainDto) {
        try {
            return await this.repository.create({
                hostname: dto.hostname,
                status: 'active',
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Hostname already exists');
            }
            throw error;
        }
    }

    async findAll(pagination: PaginationQueryDto, filters: DomainFilterQueryDto, scope: ScopeType) {
        const where: Prisma.DomainWhereInput = {};

        if (filters?.search) {
            where.hostname = { contains: filters.search, mode: 'insensitive' };
        }

        if (filters?.pwaAppId) {
            where.pwaAppId = filters.pwaAppId;
        }

        if (scope !== ScopeType.SYSTEM) {
            where.status = 'active';
        }

        const take = pagination.limit ?? 10;
        const skip = pagination.offset ?? 0;

        return this.repository.findAll({ where, skip, take });
    }

    async findOne(id: string) {
        const domain = await this.repository.findOne(id);
        if (!domain) throw new NotFoundException(`Domain ${id} not found`);
        return domain;
    }

    async update(id: string, data: UpdateDomainDto) {
        return this.repository.update(id, {
            hostname: data.hostname,
        });
    }

    async remove(id: string) {
        return this.repository.remove(id);
    }
}