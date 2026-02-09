import {Controller, UseInterceptors} from "@nestjs/common";
import {GrpcMethod, Payload} from "@nestjs/microservices";
import {
    CreateCampaignDto,
    GrpcAuthInterceptor,
    PaginationQueryDto,
} from "../../../pwa-shared/src";
import {CampaignService} from "./campaign.service";
import {ScopeInterceptor} from "../../../pwa-shared/src/common/interceptors/scope.interceptor";
import {AllowedScopes} from "../../../pwa-shared/src/common/decorators/check-scope.decorator";
import {ScopeType, CampaignFiltersQueryDto} from "../../../pwa-shared/src";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";


@Controller()
@UseInterceptors(GrpcAuthInterceptor, ScopeInterceptor)
export class CampaignGrpcController {
    constructor(private readonly service: CampaignService) {}

    @GrpcMethod('CampaignService', 'Create')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    async create(@Payload() dto: CreateCampaignDto, @GrpcUser() user: UserPayload) {
        return this.service.create(dto, user.id);
    }

    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('CampaignService', 'FindOne')
    async findOne(@Payload() dto: { id: string }) {
        return this.service.findOne(dto.id);
    }

    @GrpcMethod('CampaignService', 'FindAll')
    @AllowedScopes(ScopeType.SYSTEM)
    async findAll(@Payload() { pagination, filters }: { pagination: PaginationQueryDto, filters: CampaignFiltersQueryDto }) {
        return this.service.findAll(pagination, filters);
    }

    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('CampaignService', 'Update')
    async update(@Payload() dto: any) {
        return this.service.update(dto);
    }

    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('CampaignService', 'Delete')
    async delete(@Payload() data: { id: string }) {
        return this.service.delete(data.id);
    }
}