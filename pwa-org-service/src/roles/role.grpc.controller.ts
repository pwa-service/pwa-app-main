import {Controller, UseInterceptors} from '@nestjs/common';
import {GrpcMethod, Payload} from "@nestjs/microservices";
import { RoleService } from './role.service';
import {
    CreateRoleDto,
    UpdateRoleDto,
    RoleFilterQueryDto,
    AssignRoleDto,
    GrpcAuthInterceptor
} from "../../../pwa-shared/src";
import {GrpcPagination} from "../../../pwa-shared/src/common/decorators/pagination.decorator";
import {PaginationQueryDto} from "../../../pwa-shared/src";
import {GrpcFilters} from "../../../pwa-shared/src/common/decorators/filters.decorator";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {RolePriorityInterceptor} from "../common/interceptors/role-priority.interceptor";
import {CheckRolePriority} from "../common/decorators/check-role-priority.decorator";


@Controller()
@UseInterceptors(GrpcAuthInterceptor)
export class RoleGrpcController {
    constructor(private readonly roleService: RoleService) {}

    @GrpcMethod('RoleService', 'Create')
    @UseInterceptors(RolePriorityInterceptor)
    async create(@Payload() dto: CreateRoleDto, @GrpcUser() user: UserPayload) {
        return this.roleService.create({ ...dto }, user.scope, user.contextId);
    }

    @GrpcMethod('RoleService', 'FindOne')
    async findOne(@Payload() dto: { id: string }, @GrpcUser() user: UserPayload) {
        return this.roleService.findOne(parseInt(dto.id), user);
    }

    @GrpcMethod('RoleService', 'FindAll')
    async findAll(
        @GrpcPagination() pagination: PaginationQueryDto,
        @GrpcFilters() filters: RoleFilterQueryDto,
        @GrpcUser() user: UserPayload
    ) {
        return this.roleService.findAll(pagination, filters, user);
    }

    @GrpcMethod('RoleService', 'Update')
    @CheckRolePriority('roleId')
    @UseInterceptors(RolePriorityInterceptor)
    async update(@Payload() dto: UpdateRoleDto, @GrpcUser() user: UserPayload) {
        return this.roleService.update(dto, user.scope);
    }

    @GrpcMethod('RoleService', 'Delete')
    @CheckRolePriority('id')
    @UseInterceptors(RolePriorityInterceptor)
    async delete(@Payload() dto: { id: string }, @GrpcUser() user: UserPayload) {
        return await this.roleService.delete(dto.id, user.scope);
    }

    @GrpcMethod('RoleService', 'Assign')
    @CheckRolePriority('roleId')
    @UseInterceptors(RolePriorityInterceptor)
    async assign(@Payload() dto: AssignRoleDto, @GrpcUser() user: UserPayload) {
        return this.roleService.assignRoleToUser(dto, user.scope);
    }
}