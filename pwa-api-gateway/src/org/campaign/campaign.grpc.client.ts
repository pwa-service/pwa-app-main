import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from "@grpc/grpc-js";
import {
    PaginationQueryDto,
    UpdateCampaignDto,
    CreateCampaignDto,
    CampaignFiltersQueryDto
} from "../../../../pwa-shared/src";

interface ICampaignGrpcService {
    Create(data: CreateCampaignDto, md?: Metadata): Observable<any>;
    FindOne(data: { id: string }, md?: Metadata): Observable<any>;
    FindAll(data: { pagination?: PaginationQueryDto, filters?: CampaignFiltersQueryDto }, md?: Metadata): Observable<any>;
    Update(data: UpdateCampaignDto, md?: Metadata): Observable<any>;
    Delete(data: { id: string }, md?: Metadata): Observable<any>;
}

@Injectable()
export class CampaignGrpcClient implements OnModuleInit {
    private svc!: ICampaignGrpcService;

    constructor(@Inject('ORG_SERVICE_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<ICampaignGrpcService>('CampaignService');
    }

    async create(data: CreateCampaignDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.Create(data, metadata));
    }

    async findOne(id: string, metadata?: Metadata) {
        return lastValueFrom(this.svc.FindOne({ id }, metadata));
    }

    async findAll(pagination?: PaginationQueryDto, filters?: CampaignFiltersQueryDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.FindAll({ pagination, filters }, metadata));
    }

    async update(id: string, data: Partial<UpdateCampaignDto>, metadata?: Metadata) {
        return lastValueFrom(this.svc.Update({ id, ...data } as UpdateCampaignDto, metadata));
    }

    async delete(id: string, metadata?: Metadata) {
        return lastValueFrom(this.svc.Delete({ id }, metadata));
    }
}