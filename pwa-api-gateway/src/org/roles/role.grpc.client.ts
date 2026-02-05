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
    private svc: IRoleGrpcService;

    constructor(@Inject('ORG_SERVICE_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<IRoleGrpcService>('RoleService');
    }

    async create(data: CreateRoleDto) {
        return lastValueFrom(this.svc.Create(data));
    }

    async findOne(id: string) {
        return lastValueFrom(this.svc.FindOne({ id }));
    }

    async findAll(pagination?: PaginationQueryDto, filters?: RoleFilterQueryDto) {
        return lastValueFrom(this.svc.FindAll({ pagination, filters }));
    }

    async update(id: string, data: Partial<UpdateRoleDto>) {
        return lastValueFrom(this.svc.Update({ id, ...data }));
    }

    async delete(id: string) {
        return lastValueFrom(this.svc.Delete({ id }));
    }

    async assign(data: AssignRoleDto) {
        return lastValueFrom(this.svc.Assign(data));
    }
}