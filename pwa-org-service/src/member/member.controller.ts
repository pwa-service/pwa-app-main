import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload} from '@nestjs/microservices';
import { ScopeInterceptor } from "../../../pwa-shared/src/common/interceptors/scope.interceptor";
import { MemberService } from './member.service';
import {
    ResourceType,
    AccessLevel,
    MemberFilterQueryDto,
    GrpcAuthInterceptor
} from '../../../pwa-shared/src';
import { AllowedScopes } from "../../../pwa-shared/src/common/decorators/check-scope.decorator";
import {RequireGlobalAccess} from "../../../pwa-shared/src/common/decorators/access.decorators";
import {PaginationQueryDto, ScopeType, CreateTeamMemberDto, CreateCampaignMemberDto} from "../../../pwa-shared/src";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {GrpcPagination} from "../../../pwa-shared/src/common/decorators/pagination.decorator";
import {GrpcFilters} from "../../../pwa-shared/src/common/decorators/filters.decorator";
import {MemberScopeInterceptor} from "../common/interceptors/member-scope.interceptor";

@Controller()
@UseInterceptors(GrpcAuthInterceptor, ScopeInterceptor)
export class MemberGrpcController {
    constructor(private readonly service: MemberService) {}

    @GrpcMethod('MemberService', 'CreateCampaignMember')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @UseInterceptors(MemberScopeInterceptor)
    async createCampaignMember(@Payload() dto: CreateCampaignMemberDto, @GrpcUser() user: UserPayload) {
        return this.service.createCampaignMember(dto, user);
    }


    @GrpcMethod('MemberService', 'CreateTeamLead')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @UseInterceptors(MemberScopeInterceptor)
    async createTeamLead(@Payload() dto: CreateTeamMemberDto, @GrpcUser() user: UserPayload) {
        return this.service.createTeamLead(dto, user);
    }


    @GrpcMethod('MemberService', 'CreateTeamMember')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN, ScopeType.TEAM)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @UseInterceptors(MemberScopeInterceptor)
    async createTeamMember(@Payload() dto: CreateTeamMemberDto, @GrpcUser() user: UserPayload) {
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