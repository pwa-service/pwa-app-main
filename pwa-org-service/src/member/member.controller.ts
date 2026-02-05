import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AccessLevel, WorkingObjectType } from '@prisma/client';
import { ScopeInterceptor } from "../../../pwa-shared/src/common/interceptors/scope.interceptor";
import { GlobalSharingInterceptor } from "../../../pwa-shared/src/common/interceptors/global-sharing.interceptor";
import { WorkingObjectSharingInterceptor } from "../../../pwa-shared/src/common/interceptors/working-object-sharing.interceptor";
import { IsCampaignExistsInterceptor } from "../common/interceptors/is-campaign-exists.interceptor";
import { IsTeamExistsInterceptor } from "../common/interceptors/is-team-exists.interceptor";
import { MemberService } from './member.service';
import { ResourceType } from '../../../pwa-shared/src/types/org/sharing/enums/access.enum';
import { AllowedScopes } from "../../../pwa-shared/src/common/decorators/check-scope.decorator";
import { CanUpdate, RequireGlobalAccess } from "../../../pwa-shared/src/common/decorators/access.decorators";
import {CreateMemberDto, PaginationQueryDto} from "../../../pwa-shared/src";
import { CreateCampaignMemberDto } from "../../../pwa-shared/src/types/org/member/dto/create-campaign.dto";
import { ScopeType } from "../../../pwa-shared/src/types/org/roles/enums/scope.enum";
import {MemberFilterQueryDto} from "../../../pwa-shared/src/types/org/member/dto/filter-query.dto";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";

@Controller()
@UseInterceptors(
    ScopeInterceptor,
    GlobalSharingInterceptor,
    IsCampaignExistsInterceptor,
    IsTeamExistsInterceptor,
    WorkingObjectSharingInterceptor
)
export class MemberGrpcController {
    constructor(private readonly service: MemberService) {}

    @GrpcMethod('MemberService', 'CreateCampaignMember')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanUpdate(WorkingObjectType.CAMPAIGN, 'campaignId')
    async createCampaignMember(dto: CreateCampaignMemberDto) {
        return this.service.createCampaignMember(dto);
    }


    @GrpcMethod('MemberService', 'CreateTeamLead')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanUpdate(WorkingObjectType.TEAM, 'teamId')
    async createTeamLead(dto: CreateMemberDto) {
        return this.service.createTeamLead(dto);
    }


    @GrpcMethod('MemberService', 'CreateTeamMember')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN, ScopeType.TEAM)
    @RequireGlobalAccess(ResourceType.USERS, AccessLevel.Manage)
    @CanUpdate(WorkingObjectType.TEAM, 'teamId')
    async createTeamMember(dto: CreateMemberDto) {
        return this.service.createTeamMember(dto);
    }

    @GrpcMethod('MemberService', 'FindAll')
    async findAll(
        data: { pagination: PaginationQueryDto, filters: MemberFilterQueryDto },
        @GrpcUser() user: UserPayload
    ) {
        return this.service.findAll(data.pagination, data.filters, user);
    }
}