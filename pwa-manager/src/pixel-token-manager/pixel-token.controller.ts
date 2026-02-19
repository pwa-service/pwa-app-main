import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { PixelTokenService } from "./pixel-token.core.service";
import {
    CreatePixelTokenDto, PaginationQueryDto, PixelTokenFiltersQueryDto, UpdatePixelTokenDto
} from "../../../pwa-shared/src";
import { GrpcAuthInterceptor } from "../../../pwa-shared/src";
import { GrpcUser } from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import { IsPixelTokenUnique } from "../common/pipes/is-pixel-token-unique.pipe";
import { IsPixelTokenExistsInterceptor } from "../common/interceptors/is-pxiel-token-exists.interceptor";
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import { GrpcPagination } from "../../../pwa-shared/src/common/decorators/pagination.decorator";
import { GrpcFilters } from "../../../pwa-shared/src/common/decorators/filters.decorator";

@Controller()
@UseInterceptors(GrpcAuthInterceptor)
export class PixelTokenController {
    constructor(private readonly service: PixelTokenService) { }

    @GrpcMethod('PixelTokenService', 'Create')
    async create(@Payload(IsPixelTokenUnique) dto: CreatePixelTokenDto, @GrpcUser() user: UserPayload) {
        dto.ownerId = user.id;
        return this.service.create(dto);
    }

    @GrpcMethod('PixelTokenService', 'FindAll')
    async findAll(
        @GrpcPagination() pagination: PaginationQueryDto,
        @GrpcFilters() filters: PixelTokenFiltersQueryDto,
        @GrpcUser() user: UserPayload
    ) {
        return this.service.findAll(pagination, filters, user.id);
    }

    @UseInterceptors(IsPixelTokenExistsInterceptor)
    @GrpcMethod('PixelTokenService', 'FindOne')
    async findOne(@Payload() dto: { id: string }) {
        return this.service.findOne(dto.id);
    }

    @UseInterceptors(IsPixelTokenExistsInterceptor)
    @GrpcMethod('PixelTokenService', 'Update')
    async update(@Payload(IsPixelTokenUnique) dto: UpdatePixelTokenDto) {
        return this.service.update(dto);
    }

    @UseInterceptors(IsPixelTokenExistsInterceptor)
    @GrpcMethod('PixelTokenService', 'Remove')
    async remove(@Payload() dto: { id: string }) {
        return this.service.remove(dto.id);
    }
}