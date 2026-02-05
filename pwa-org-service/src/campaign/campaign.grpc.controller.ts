import {Controller, UseInterceptors} from "@nestjs/common";
import {GrpcMethod} from "@nestjs/microservices";
import {CreateCampaignDto, PaginationQueryDto, PixelTokenFiltersQueryDto} from "../../../pwa-shared/src";
import {CampaignService} from "./campaign.service";
import {CampaignFiltersQueryDto} from "../../../pwa-shared/src/types/org/campaign/dto/filters-query.dto";
import {IsCampaignExistsInterceptor} from "../common/interceptors/is-campaign-exists.interceptor";
import {ScopeInterceptor} from "../../../pwa-shared/src/common/interceptors/scope.interceptor";
import {AllowedScopes} from "../../../pwa-shared/src/common/decorators/check-scope.decorator";
import {ScopeType} from "../../../pwa-shared/src/types/org/roles/enums/scope.enum";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";


@Controller()
export class CampaignGrpcController {
    constructor(private readonly service: CampaignService) {}

    @GrpcMethod('CampaignService', 'Create')
    async create(dto: CreateCampaignDto, @GrpcUser() user: UserPayload) {
        return this.service.create(dto, user.id);
    }

    @UseInterceptors(ScopeInterceptor, IsCampaignExistsInterceptor)
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('CampaignService', 'FindOne')
    async findOne(dto: { id: string }) {
        return this.service.findOne(dto.id);
    }

    @GrpcMethod('CampaignService', 'FindAll')
    @UseInterceptors(ScopeInterceptor)
    @AllowedScopes(ScopeType.SYSTEM)
    async findAll({ pagination, filters }: { pagination: PaginationQueryDto, filters: CampaignFiltersQueryDto }) {
        return this.service.findAll(pagination, filters);
    }

    @UseInterceptors(ScopeInterceptor, IsCampaignExistsInterceptor)
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('CampaignService', 'Update')
    async update(dto: any) {
        return this.service.update(dto);
    }

    @UseInterceptors(IsCampaignExistsInterceptor)
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('CampaignService', 'Delete')
    async delete(data: { id: string }) {
        return this.service.delete(data.id);
    }
}