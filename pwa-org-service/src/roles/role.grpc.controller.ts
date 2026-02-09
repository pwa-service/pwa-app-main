import {Controller, UseInterceptors} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleService } from './role.service';
import {
    CreateRoleDto,
    UpdateRoleDto,
    RoleFilterQueryDto,
    AssignRoleDto,
    GrpcAuthInterceptor, WorkingObjectType
} from "../../../pwa-shared/src";
import {GrpcPagination} from "../../../pwa-shared/src/common/decorators/pagination.decorator";
import {PaginationQueryDto} from "../../../pwa-shared/src";
import {GrpcFilters} from "../../../pwa-shared/src/common/decorators/filters.decorator";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {
    WorkingObjectSharingInterceptor
} from "../../../pwa-shared/src/common/interceptors/working-object-sharing.interceptor";


@Controller()
@UseInterceptors(GrpcAuthInterceptor)
export class RoleGrpcController {
    constructor(private readonly roleService: RoleService) {}

    @GrpcMethod('RoleService', 'Create')
    async create(dto: CreateRoleDto, @GrpcUser() user: UserPayload) {
        return this.roleService.create({ ...dto }, user.scope, user.contextId);
    }

    @GrpcMethod('RoleService', 'FindOne')
    async findOne(dto: { id: string }, @GrpcUser() user: UserPayload) {
        return this.roleService.findOne(dto.id, user);
    }

    @GrpcMethod('RoleService', 'FindAll')
    async findAll(@GrpcPagination() pagination: PaginationQueryDto, @GrpcFilters() filters: RoleFilterQueryDto, @GrpcUser() user: UserPayload) {
        return this.roleService.findAll(pagination, filters, user);
    }

    @GrpcMethod('RoleService', 'Update')
    async update(dto: UpdateRoleDto, @GrpcUser() user: UserPayload) {
        return this.roleService.update(dto, user.scope);
    }

    @GrpcMethod('RoleService', 'Delete')
    async delete(dto: { id: string }, @GrpcUser() user: UserPayload) {
        return await this.roleService.delete(dto.id, user.scope);
    }

    @GrpcMethod('RoleService', 'Assign')
    async assign(dto: AssignRoleDto, @GrpcUser() user: UserPayload) {
        return this.roleService.assignRoleToUser(dto, user.scope);
    }
}