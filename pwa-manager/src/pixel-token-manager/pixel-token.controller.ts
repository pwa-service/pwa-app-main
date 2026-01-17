import {Controller, UseInterceptors} from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {PixelTokenService} from "./pixel-token.core.service";
import {
    CreatePixelTokenDto, UpdatePixelTokenDto
} from "../../../pwa-shared/src/types/pwa-manager/pixel-token-manager/dto/create-pixel-token.dto";
import {GrpcAuthInterceptor, UserRecord} from "../../../pwa-shared/src/modules/auth/interceptors/grpc-auth.interceptor";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {IsPixelTokenUnique} from "./pipes/is-pixel-token-unique.pipe";

@Controller()
@UseInterceptors(GrpcAuthInterceptor)
export class PixelTokenController {
    constructor(private readonly service: PixelTokenService) {}

    @GrpcMethod('PixelTokenService', 'Create')
    async create(@Payload(IsPixelTokenUnique) dto: CreatePixelTokenDto, @GrpcUser() user: UserRecord) {
        return this.service.create(user.id, dto);
    }

    @GrpcMethod('PixelTokenService', 'FindAll')
    async findAll(@GrpcUser() user: UserRecord) {
        return this.service.findAll(user.id);
    }

    @GrpcMethod('PixelTokenService', 'FindOne')
    async findOne(@Payload() dto: { id: string }) {
        return this.service.findOne(dto.id);
    }

    @GrpcMethod('PixelTokenService', 'Update')
    async update(@Payload(IsPixelTokenUnique) dto: UpdatePixelTokenDto, @GrpcUser() user: UserRecord) {
        return this.service.update(dto);
    }

    @GrpcMethod('PixelTokenService', 'Remove')
    async remove(@Payload(IsPixelTokenUnique) dto: { id: string }) {
        return this.service.remove(dto.id);
    }
}