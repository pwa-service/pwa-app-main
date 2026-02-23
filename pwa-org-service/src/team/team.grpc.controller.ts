import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { TeamService } from './team.service';
import {
    AddMemberDto,
    AssignLeadDto,
    CreateTeamDto,
    PaginationQueryDto,
    RemoveMemberDto,
    TeamFilterQueryDto,
    UpdateTeamDto,
    ScopeType, GrpcAuthInterceptor
} from '../../../pwa-shared/src';
import { GrpcUser } from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import { ScopeInterceptor } from "../../../pwa-shared/src/common/interceptors/scope.interceptor";
import { AllowedScopes } from "../../../pwa-shared/src/common/decorators/check-scope.decorator";
import { GrpcPagination } from "../../../pwa-shared/src/common/decorators/pagination.decorator";
import { GrpcFilters } from "../../../pwa-shared/src/common/decorators/filters.decorator";
import { IsLeadBelongsToCampaignInterceptor } from '../common/interceptors/is-lead-belongs-to-campaign.interceptor';
import { IsCampaignExists } from '../common/pipes/is-campaign-exists.pipe';
import { IsTeamExists } from '../common/pipes/is-team-exists.pipe';
import { IsUserProfileExists } from '../common/pipes/is-user-profile-exists.pipe';


@Controller()
@UseInterceptors(GrpcAuthInterceptor, ScopeInterceptor)
export class TeamGrpcController {
    constructor(private readonly service: TeamService) { }

    @UseInterceptors(ScopeInterceptor, IsLeadBelongsToCampaignInterceptor)
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('TeamService', 'Create')
    async create(@Payload(IsCampaignExists, IsUserProfileExists) data: CreateTeamDto) {
        return this.service.create(data);
    }

    @GrpcMethod('TeamService', 'FindOne')
    async findOne(@Payload() data: { id: string }) {
        return this.service.findOne(data.id);
    }

    @GrpcMethod('TeamService', 'Update')
    async update(@Payload() data: UpdateTeamDto) {
        return this.service.update(data);
    }

    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('TeamService', 'Delete')
    async delete(@Payload() data: { id: string }) {
        return this.service.delete(data.id);
    }

    @GrpcMethod('TeamService', 'FindAll')
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    async findAll(
        @GrpcPagination() pagination: PaginationQueryDto,
        @GrpcFilters() filters: TeamFilterQueryDto,
        @GrpcUser() user: UserPayload
    ) {
        return this.service.findAll(pagination, filters, user);
    }

    @GrpcMethod('TeamService', 'AddMemberToTeam')
    async addMember(@Payload(IsTeamExists, IsUserProfileExists) data: AddMemberDto) {
        return this.service.addMemberToTeam(data);
    }

    @GrpcMethod('TeamService', 'RemoveMember')
    async removeMember(@Payload(IsTeamExists, IsUserProfileExists) data: RemoveMemberDto) {
        return this.service.removeMember(data);
    }

    @UseInterceptors(ScopeInterceptor)
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('TeamService', 'AssignTeamLead')
    async assignTeamLead(@Payload(IsTeamExists, IsUserProfileExists) data: AssignLeadDto) {
        return this.service.assignTeamLead(data);
    }
}