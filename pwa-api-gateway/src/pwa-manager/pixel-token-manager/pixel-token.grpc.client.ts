import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom, Observable } from 'rxjs';
import {
    CreatePixelTokenDto, PixelTokenFiltersQueryDto, PaginationQueryDto, UpdatePixelTokenDto
} from "../../../../pwa-shared/src";


interface PixelTokenService {
    Create(data: CreatePixelTokenDto, md?: Metadata): Observable<any>;
    FindAll(data: {pagination: PaginationQueryDto, filters: PixelTokenFiltersQueryDto}, md?: Metadata): Observable<any>;
    FindOne(data: { id: string }, md?: Metadata): Observable<any>;
    Update(data: UpdatePixelTokenDto, md?: Metadata): Observable<any>;
    Remove(data: { id: string }, md?: Metadata): Observable<any>;
}

@Injectable()
export class PixelTokenGrpcClient implements OnModuleInit {
    private svc!: PixelTokenService;

    constructor(@Inject('PIXEL_TOKEN_MANAGER_GRPC') private client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<PixelTokenService>('PixelTokenService');
    }

    async create(dto: CreatePixelTokenDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.Create(dto, metadata));
    }

    async findAll(pagination: PaginationQueryDto, filters: PixelTokenFiltersQueryDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.FindAll({pagination, filters}, metadata));
    }

    async findOne(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.FindOne({ id }, metadata));
    }

    async update(id: string, dto: UpdatePixelTokenDto, metadata?: Metadata) {
        dto.id = id
        return await lastValueFrom(this.svc.Update({ ...dto }, metadata));
    }

    async remove(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.Remove({ id }, metadata));
    }
}