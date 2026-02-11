import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload} from '@nestjs/microservices';
import { ScopeInterceptor } from "../../../pwa-shared/src/common/interceptors/scope.interceptor";
import { MemberService } from './member.service';
import {
    ResourceType,
    AccessLevel,
    MemberFilterQueryDto,
    WorkingObjectType,
    GrpcAuthInterceptor
} from '../../../pwa-shared/src';
import { AllowedScopes } from "../../../pwa-shared/src/common/decorators/check-scope.decorator";
import {CanCreate, CanUpdate, RequireGlobalAccess} from "../../../pwa-shared/src/common/decorators/access.decorators";
import {PaginationQueryDto, ScopeType} from "../../../pwa-shared/src";
import { CreateCampaignMemberDto } from "../../../pwa-shared/src";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {GrpcPagination} from "../../../pwa-shared/src/common/decorators/pagination.decorator";
import {GrpcFilters} from "../../../pwa-shared/src/common/decorators/filters.decorator";

@Controller()
@UseInterceptors(GrpcAuthInterceptor, ScopeInterceptor)
export class MemberGrpcController {
    constructor(private readonly service: MemberService) {}

    @GrpcMethod('MemberService', 'CreateCampaignMember')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanCreate(WorkingObjectType.CAMPAIGN, 'campaignId')
    async createCampaignMember(@Payload() dto: CreateCampaignMemberDto, @GrpcUser() user: UserPayload) {
        return this.service.createCampaignMember(dto, user);
    }


    @GrpcMethod('MemberService', 'CreateTeamLead')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanUpdate(WorkingObjectType.TEAM, 'teamId')
    async createTeamLead(@Payload() dto: CreateCampaignMemberDto, @GrpcUser() user: UserPayload) {
        return this.service.createTeamLead(dto, user);
    }


    @GrpcMethod('MemberService', 'CreateTeamMember')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN, ScopeType.TEAM)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanUpdate(WorkingObjectType.TEAM, 'teamId')
    async createTeamMember(@Payload() dto: CreateCampaignMemberDto, @GrpcUser() user: UserPayload) {
        return this.service.createTeamMember(dto, user);
    }

    @GrpcMethod('MemberService', 'FindAll')
    async findAll(
        @GrpcPagination() pagination: PaginationQueryDto,
        @GrpcFilters() filters:MemberFilterQueryDto,
        @GrpcUser() user: UserPayload
    ) {
        return this.service.findAll(pagination, filters, user);
    }
}