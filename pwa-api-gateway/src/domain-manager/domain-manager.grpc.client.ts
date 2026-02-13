import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from "@grpc/grpc-js";
import { CreateDomainDto, UpdateDomainDto } from "../../../pwa-shared/src";
import { DomainFilterQueryDto, PaginationQueryDto } from "../../../pwa-shared/src";


interface IDomainGrpcService {
    Create(data: CreateDomainDto, metadata?: Metadata): Observable<any>;
    FindAll(data: { pagination: PaginationQueryDto, filters: DomainFilterQueryDto }, metadata?: Metadata): Observable<any>;
    FindOne(data: { id: string }, metadata?: Metadata): Observable<any>;
    Update(data: UpdateDomainDto & { id: string }, metadata?: Metadata): Observable<any>;
    Remove(data: { id: string }, metadata?: Metadata): Observable<any>;
}

@Injectable()
export class DomainGrpcClient implements OnModuleInit {
    private svc!: IDomainGrpcService;

    constructor(@Inject('DOMAIN_MANAGER_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<IDomainGrpcService>('DomainService');
    }

    async create(dto: CreateDomainDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.Create(dto, metadata));
    }

    async findAll(pagination: PaginationQueryDto, filters: DomainFilterQueryDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.FindAll({ pagination, filters }, metadata));
    }

    async findOne(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.FindOne({ id }, metadata));
    }

    async update(id: string, dto: UpdateDomainDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.Update({ ...dto, id }, metadata));
    }

    async remove(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.Remove({ id }, metadata));
    }
}