import {Controller, UseInterceptors} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import {TeamService} from './team.service';
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
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {ScopeInterceptor} from "../../../pwa-shared/src/common/interceptors/scope.interceptor";
import {AllowedScopes} from "../../../pwa-shared/src/common/decorators/check-scope.decorator";


@Controller()
@UseInterceptors(GrpcAuthInterceptor, ScopeInterceptor)
export class TeamGrpcController {
    constructor(private readonly service: TeamService) {}

    @UseInterceptors(ScopeInterceptor)
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('TeamService', 'Create')
    async create(data: CreateTeamDto) {
        return this.service.create(data);
    }

    @GrpcMethod('TeamService', 'FindOne')
    async findOne(data: { id: string }) {
        return this.service.findOne(data.id);
    }

    @GrpcMethod('TeamService', 'Update')
    async update(data: UpdateTeamDto) {
        return this.service.update(data);
    }

    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('TeamService', 'Delete')
    async delete(data: { id: string }) {
        return this.service.delete(data.id);
    }

    @GrpcMethod('TeamService', 'FindAll')
    async findAll(
        data: { pagination: PaginationQueryDto, filters: TeamFilterQueryDto },
        @GrpcUser() user: UserPayload
    ) {
        return this.service.findAll(data.pagination, data.filters, user);
    }

    @GrpcMethod('TeamService', 'AddMemberToTeam')
    async addMember(data: AddMemberDto) {
        return this.service.addMemberToTeam(data);
    }

    @GrpcMethod('TeamService', 'RemoveMember')
    async removeMember(data: RemoveMemberDto) {
        return this.service.removeMember(data);
    }

    @UseInterceptors(ScopeInterceptor)
    @AllowedScopes(ScopeType.SYSTEM, ScopeType.CAMPAIGN)
    @GrpcMethod('TeamService', 'AssignTeamLead')
    async assignTeamLead(data: AssignLeadDto) {
        return this.service.assignTeamLead(data);
    }
}