import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
    CreatePixelTokenDto, PaginationQueryDto, PixelTokenFiltersQueryDto, UpdatePixelTokenDto
} from "../../../pwa-shared/src";
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import { PixelTokenRepository } from "./pixel-token.repository";


@Injectable()
export class PixelTokenService {
    constructor(private readonly repository: PixelTokenRepository) { }

    async create(dto: CreatePixelTokenDto, user: UserPayload) {
        const membership = await this.repository.findUserMembership(user.id);

        if (!membership.campaignId) {
            throw new RpcException({ code: 9, message: 'User does not belong to any campaign' });
        }

        return this.repository.create({
            ...dto,
            ownerId: user.id,
            campaignId: membership.campaignId,
            teamId: membership.teamId || undefined,
        });
    }

    async findAll(pagination: PaginationQueryDto, filters: PixelTokenFiltersQueryDto, user: UserPayload) {
        const { items, total } = await this.repository.findAll(pagination, filters, user);
        return { pixelTokens: items, total };
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