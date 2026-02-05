import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleService } from './role.service';
import {CreateRoleDto} from "../../../pwa-shared/src/types/org/roles/dto/create-role.dto";
import {UpdateRoleDto} from "../../../pwa-shared/src/types/org/roles/dto/update-role.dto";
import {GrpcPagination} from "../../../pwa-shared/src/common/decorators/pagination.decorator";
import {PaginationQueryDto} from "../../../pwa-shared/src";
import {GrpcFilters} from "../../../pwa-shared/src/common/decorators/filters.decorator";
import {RoleFilterQueryDto} from "../../../pwa-shared/src/types/org/roles/dto/filters-query.dto";
import {AssignRoleDto} from "../../../pwa-shared/src/types/org/roles/dto/assign-role.dto";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";


@Controller()
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