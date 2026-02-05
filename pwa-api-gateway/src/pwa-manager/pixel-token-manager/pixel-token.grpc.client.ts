import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom, Observable } from 'rxjs';
import {
    CreatePixelTokenDto, UpdatePixelTokenDto
} from "../../../../pwa-shared/src";


interface PixelTokenService {
    create(data: CreatePixelTokenDto, md?: Metadata): Observable<any>;
    findAll(data: {}, md?: Metadata): Observable<any>;
    findOne(data: { id: string }, md?: Metadata): Observable<any>;
    update(data: UpdatePixelTokenDto, md?: Metadata): Observable<any>;
    remove(data: { id: string }, md?: Metadata): Observable<any>;
}

@Injectable()
export class PixelTokenGrpcClient implements OnModuleInit {
    private svc!: PixelTokenService;

    constructor(@Inject('PIXEL_TOKEN_MANAGER_GRPC') private client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<PixelTokenService>('PixelTokenService');
    }

    async create(dto: CreatePixelTokenDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.create(dto, metadata));
    }

    async findAll(metadata?: Metadata) {
        return await lastValueFrom(this.svc.findAll({}, metadata));
    }

    async findOne(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.findOne({ id }, metadata));
    }

    async update(id: string, dto: UpdatePixelTokenDto, metadata?: Metadata) {
        dto.id = id
        return await lastValueFrom(this.svc.update({ ...dto }, metadata));
    }

    async remove(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.remove({ id }, metadata));
    }
}