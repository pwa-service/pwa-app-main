import { Injectable, NotFoundException } from '@nestjs/common';
import {
    CreatePixelTokenDto, UpdatePixelTokenDto
} from "../../../pwa-shared/src/types/pwa-manager/pixel-token-manager/dto/create-pixel-token.dto";
import {PixelTokenRepository} from "./pixel-token.repository";


@Injectable()
export class PixelTokenService {
    constructor(private readonly repository: PixelTokenRepository) {}
    async create(ownerId: string, dto: CreatePixelTokenDto) {
        return this.repository.create({
            id: dto.id,
            token: dto.token,
            description: dto.description,
            ownerId
        });
    }

    async findAll(userId: string) {
        const pixelTokens = await this.repository.findAll(userId);
        return {
            pixelTokens
        }
    }

    async findOne(id: string) {
        const token = await this.repository.findOne(id);
        if (!token) throw new NotFoundException(`Token ${id} not found`);
        return token;
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