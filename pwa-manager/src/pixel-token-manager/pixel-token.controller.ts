import {Controller, UseInterceptors} from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {PixelTokenService} from "./pwa-manager.core.service";
import {
    CreatePixelTokenDto, UpdatePixelTokenDto
} from "../../../pwa-shared/src/types/pwa-manager/pixel-token-manager/dto/create-pixel-token.dto";
import {GrpcAuthInterceptor, UserRecord} from "../../../pwa-shared/src/modules/auth/interceptors/grpc-auth.interceptor";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";

@Controller()
@UseInterceptors(GrpcAuthInterceptor)
export class PixelTokenController {
    constructor(private readonly service: PixelTokenService) {}

    @GrpcMethod('PixelTokenService', 'Create')
    async create(@Payload() data: CreatePixelTokenDto, @GrpcUser() user: UserRecord) {
        return this.service.create(user.id, data);
    }

    @GrpcMethod('PixelTokenService', 'FindAll')
    async findAll(@GrpcUser() user: UserRecord) {
        return this.service.findAll(user.id);
    }

    @GrpcMethod('PixelTokenService', 'FindOne')
    async findOne(@Payload() data: { id: string }) {
        return this.service.findOne(data.id);
    }

    @GrpcMethod('PixelTokenService', 'Update')
    async update(@Payload() data: UpdatePixelTokenDto, @GrpcUser() user: UserRecord) {
        return this.service.update(user.id, data);
    }

    @GrpcMethod('PixelTokenService', 'Remove')
    async remove(@Payload() data: { id: string }) {
        return this.service.remove(data.id);
    }
}