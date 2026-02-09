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
import {CreateMemberDto, PaginationQueryDto, ScopeType} from "../../../pwa-shared/src";
import { CreateCampaignMemberDto } from "../../../pwa-shared/src/types/org/member/dto/create-campaign.dto";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {GrpcPagination} from "../../../pwa-shared/src/common/decorators/pagination.decorator";

@Controller()
@UseInterceptors(GrpcAuthInterceptor, ScopeInterceptor)
export class MemberGrpcController {
    constructor(private readonly service: MemberService) {}

    @GrpcMethod('MemberService', 'CreateCampaignMember')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanCreate(WorkingObjectType.CAMPAIGN, 'campaignId')
    async createCampaignMember(@Payload() dto: CreateCampaignMemberDto) {
        return this.service.createCampaignMember(dto);
    }


    @GrpcMethod('MemberService', 'CreateTeamLead')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanUpdate(WorkingObjectType.TEAM, 'teamId')
    async createTeamLead(@Payload() dto: CreateMemberDto) {
        return this.service.createTeamLead(dto);
    }


    @GrpcMethod('MemberService', 'CreateTeamMember')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN, ScopeType.TEAM)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanUpdate(WorkingObjectType.TEAM, 'teamId')
    async createTeamMember(@Payload() dto: CreateMemberDto) {
        return this.service.createTeamMember(dto);
    }

    @GrpcMethod('MemberService', 'FindAll')
    async findAll(
        @GrpcPagination() data: { pagination: PaginationQueryDto, filters: MemberFilterQueryDto },
        @GrpcUser() user: UserPayload
    ) {
        return this.service.findAll(data.pagination, data.filters, user);
    }
}