import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from "@grpc/grpc-js";
import {
    CreateRoleDto,
    UpdateRoleDto,
    PaginationQueryDto
} from "../../../../pwa-shared/src";
import { RoleFilterQueryDto } from "../../../../pwa-shared/src/types/org/roles/dto/filters-query.dto";
import { AssignRoleDto } from "../../../../pwa-shared/src/types/org/roles/dto/assign-role.dto";

interface IRoleGrpcService {
    Create(data: CreateRoleDto, md?: Metadata): Observable<any>;
    FindOne(data: { id: string }, md?: Metadata): Observable<any>;
    FindAll(data: { pagination?: PaginationQueryDto, filters?: RoleFilterQueryDto }, md?: Metadata): Observable<any>;
    Update(data: UpdateRoleDto, md?: Metadata): Observable<any>;
    Delete(data: { id: string }, md?: Metadata): Observable<any>;
    Assign(data: AssignRoleDto, md?: Metadata): Observable<any>;
}

@Injectable()
export class RoleGrpcClient implements OnModuleInit {
    private svc!: IRoleGrpcService;

    constructor(@Inject('ORG_SERVICE_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<IRoleGrpcService>('RoleService');
    }

    async create(data: CreateRoleDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.Create(data, metadata));
    }

    async findOne(id: string, metadata?: Metadata) {
        return lastValueFrom(this.svc.FindOne({ id }, metadata));
    }

    async findAll(pagination?: PaginationQueryDto, filters?: RoleFilterQueryDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.FindAll({ pagination, filters }, metadata));
    }

    async update(id: string, data: Partial<UpdateRoleDto>, metadata?: Metadata) {
        return lastValueFrom(this.svc.Update({ id, ...data }, metadata));
    }

    async delete(id: string, metadata?: Metadata) {
        return lastValueFrom(this.svc.Delete({ id }, metadata));
    }

    async assign(data: AssignRoleDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.Assign(data, metadata));
    }
}