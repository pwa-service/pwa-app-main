import { Injectable } from '@nestjs/common';
import {
    CreatePixelTokenDto, PaginationQueryDto, PixelTokenFiltersQueryDto, UpdatePixelTokenDto
} from "../../../pwa-shared/src";
import {PixelTokenRepository} from "./pixel-token.repository";


@Injectable()
export class PixelTokenService {
    constructor(private readonly repository: PixelTokenRepository) {}

    async create(dto: CreatePixelTokenDto) {
        return this.repository.create(dto);
    }

    async findAll(pagination: PaginationQueryDto, filters: PixelTokenFiltersQueryDto, userId: string) {
        return await this.repository.findAll(pagination, filters, userId);
    }

    async findOne(id: string) {
        return await this.repository.findOne(id);
    }

    async update(dto: UpdatePixelTokenDto) {
        return await this.repository.update({
            id: dto.id,
            token: dto.token,
            description: dto.description,
        });
    }

    async remove(id: string) {
        const deleted = await this.repository.delete(id);
        return { success: !!deleted, id: deleted.id };
    }

}