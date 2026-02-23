import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom, Observable } from 'rxjs';
import {
    CreateAppDto,
    UpdateAppDto,
    PaginationQueryDto
} from '../../../../pwa-shared/src';

interface PwaAppsManagerService {
    CreateApp(data: CreateAppDto, md?: Metadata): Observable<any>;
    GetAppById(data: { app_id: string }, md?: Metadata): Observable<any>;
    FindAll(data: { pagination: PaginationQueryDto }, md?: Metadata): Observable<any>;
    UpdateApp(data: UpdateAppDto & { id: string }, md?: Metadata): Observable<any>;
    DeleteApp(data: { id: string }, md?: Metadata): Observable<any>;
}

@Injectable()
export class PwaManagerGrpcClient implements OnModuleInit {
    private svc!: PwaAppsManagerService;

    constructor(@Inject('APPS_MANAGER_GRPC') private client: ClientGrpc) { }

    onModuleInit() {
        this.svc = this.client.getService<PwaAppsManagerService>('PwaAppsManagerService');
    }

    async createApp(dto: CreateAppDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.CreateApp(dto, metadata));
    }

    async getAppById(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.GetAppById({ app_id: id }, metadata));
    }

    async findAll(pagination: PaginationQueryDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.FindAll({ pagination }, metadata));
    }

    async updateApp(id: string, dto: UpdateAppDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.UpdateApp({ id, ...dto }, metadata));
    }

    async deleteApp(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.DeleteApp({ id }, metadata));
    }
}