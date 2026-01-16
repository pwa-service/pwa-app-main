import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import {
    CreatePixelTokenDto, UpdatePixelTokenDto
} from "../../../../pwa-shared/src/types/pwa-manager/pixel-token-manager/dto/create-pixel-token.dto";
import { PixelIdDto } from "../types/pixel-id.dto";
import {PixelTokenRepository} from "../pixel-token.repository";


@Injectable()
export class IsPixelTokenUnique implements PipeTransform {
    constructor(private readonly repo: PixelTokenRepository) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;

        if (!value) return value;
        const { id, token } = value;
        if (metatype === CreatePixelTokenDto) {
            if (token) {
                const existingToken = await this.repo.findOneByToken(token);
                if (existingToken) {
                    throw new RpcException({
                        code: status.ALREADY_EXISTS,
                        message: `Pixel token "${token}" already exists`,
                    });
                }
            }

            if (id) {
                const entityById = await this.repo.findOne(id); // Використовуйте findOneBy або { where: { id } }
                if (entityById) {
                    throw new RpcException({
                        code: status.ALREADY_EXISTS,
                        message: `Pixel token with ID ${id} already exists`,
                    });
                }
            }
        }

        if (metatype === UpdatePixelTokenDto || metatype === PixelIdDto) {
            if (id) {
                const entityById = await this.repo.findOne(id);
                if (!entityById) {
                    throw new RpcException({
                        code: status.NOT_FOUND,
                        message: `Pixel token entity with ID "${id}" not found`,
                    });
                }
            }

            if (token) {
                const existingToken = await this.repo.findOneByToken(token);
                if (existingToken) {
                    if (id && existingToken.id === id) {
                        return value;
                    }
                    throw new RpcException({
                        code: status.ALREADY_EXISTS,
                        message: `Pixel token "${token}" already exists`,
                    });
                }
            }
        }

        return value;
    }
}