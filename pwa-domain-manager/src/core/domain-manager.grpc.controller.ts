import {Controller, UseInterceptors} from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { DomainManagerService } from './domain-manager.service';
import {
    PaginationQueryDto,
    DomainFilterQueryDto,
    GrpcAuthInterceptor,
    ScopeType,
    UpdateDomainDto
} from "../../../pwa-shared/src";
import {ScopeInterceptor} from "../../../pwa-shared/src/common/interceptors/scope.interceptor";
import {AllowedScopes} from "../../../pwa-shared/src/common/decorators/check-scope.decorator";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";


@Controller()
@UseInterceptors(GrpcAuthInterceptor, ScopeInterceptor)
export class DomainManagerGrpcController {
    constructor(private readonly service: DomainManagerService) {}

    @AllowedScopes(ScopeType.SYSTEM)
    @GrpcMethod('DomainService', 'Create')
    async create(@Payload() data: any) {
        return this.service.create(data);
    }

    @GrpcMethod('DomainService', 'FindAll')
    async findAll(@Payload() { pagination, filters }: { pagination: PaginationQueryDto, filters: DomainFilterQueryDto }, @GrpcUser() user: UserPayload) {
        return this.service.findAll(pagination, filters, user.scope);
    }

    @GrpcMethod('DomainService', 'FindOne')
    async findOne(@Payload() data: { id: string }) {
        return this.service.findOne(data.id);
    }

    @AllowedScopes(ScopeType.SYSTEM)
    @GrpcMethod('DomainService', 'Update')
    async update(@Payload() data: UpdateDomainDto) {
        return this.service.update(data.id, data);
    }

    @AllowedScopes(ScopeType.SYSTEM)
    @GrpcMethod('DomainService', 'Remove')
    async remove(@Payload() data: { id: string }) {
        return this.service.remove(data.id);
    }
}