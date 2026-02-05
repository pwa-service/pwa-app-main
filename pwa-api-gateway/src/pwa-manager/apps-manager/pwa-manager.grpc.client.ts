import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import {lastValueFrom, Observable} from 'rxjs';
import { CreateAppDto } from '../../../../pwa-shared/src';


interface PwaManagerService {
    CreateApp(data: CreateAppDto, md?: Metadata): Observable<any>;
    GetAppById(id: string, md?: Metadata): Observable<any>;
}

@Injectable()
export class PwaManagerGrpcClient implements OnModuleInit {
    private svc!: PwaManagerService;

    constructor(@Inject('APPS_MANAGER_GRPC') private client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<PwaManagerService>('PwaAppsManagerService');
    }

    async createApp(dto: CreateAppDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.CreateApp(dto, metadata));
    }


    async getAppById(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.GetAppById(id, metadata));
    }
}