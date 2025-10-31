import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom } from 'rxjs';
import { CreateAppDto } from '../../../pwa-shared/src';


interface GeneratorService {
    createApp(data: CreateAppDto, md?: Metadata): any;
    getAppById(id: string, md?: Metadata): any;
}

@Injectable()
export class GeneratorGrpcClient implements OnModuleInit {
    private svc!: GeneratorService;

    constructor(@Inject('GENERATOR_GRPC') private client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<GeneratorService>('GeneratorService');
    }

    async createApp(dto: CreateAppDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.createApp(dto, metadata));
    }


    async getAppById(id: string, metadata?: Metadata) {
        return await lastValueFrom(this.svc.getAppById(id, metadata));
    }
}