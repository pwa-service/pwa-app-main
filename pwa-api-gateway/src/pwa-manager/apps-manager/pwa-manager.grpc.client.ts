import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom, Observable } from 'rxjs';
import {
    CreateAppDto,
    UpdateAppDto,
    PaginationQueryDto
} from '../../../../pwa-shared/src';

// Інтерфейс має відповідати методам у .proto файлі
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

    constructor(@Inject('APPS_MANAGER_GRPC') private client: ClientGrpc) {}

    onModuleInit() {
        // Назва сервісу має точно збігатися з package/service у .proto
        this.svc = this.client.getService<PwaAppsManagerService>('PwaAppsManagerService');
    }

    // --- CREATE ---
    async createApp(dto: CreateAppDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.CreateApp(dto, metadata));
    }

    // --- GET ONE ---
    async getAppById(id: string, metadata?: Metadata) {
        // gRPC очікує об'єкт { app_id: ... }
        return await lastValueFrom(this.svc.GetAppById({ app_id: id }, metadata));
    }

    // --- GET ALL ---
    async findAll(pagination: PaginationQueryDto, metadata?: Metadata) {
        // gRPC очікує об'єкт { pagination: ... }
        return await lastValueFrom(this.svc.FindAll({ pagination }, metadata));
    }

    // --- UPDATE ---
    async updateApp(id: string, dto: UpdateAppDto, metadata?: Metadata) {
        // gRPC очікує об'єднання ID та полів для оновлення
        return await lastValueFrom(this.svc.UpdateApp({ id, ...dto }, metadata));
    }

    // --- DELETE ---
    async deleteApp(id: string, metadata?: Metadata) {
        // gRPC очікує об'єкт { id: ... }
        return await lastValueFrom(this.svc.DeleteApp({ id }, metadata));
    }
}