import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import {
    PaginationQueryDto,
    UpdateCampaignDto,
    CreateCampaignDto,
    CampaignFiltersQueryDto
} from "../../../../pwa-shared/src";
import { Metadata } from "@grpc/grpc-js";

interface ICampaignGrpcService {
    Create(data: CreateCampaignDto, md?: Metadata): Observable<any>;
    FindOne(data: { id: string }, md?: Metadata): Observable<any>;
    FindAll(data: { pagination?: PaginationQueryDto, filters?: CampaignFiltersQueryDto }): Observable<any>;
    Update(data: UpdateCampaignDto, md?: Metadata): Observable<any>;
    Delete(data: { id: string }, md?: Metadata): Observable<any>;
}

@Injectable()
export class CampaignGrpcClient implements OnModuleInit {
    private svc: ICampaignGrpcService;

    constructor(@Inject('ORG_SERVICE_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<ICampaignGrpcService>('CampaignService');
    }

    async create(data: CreateCampaignDto) {
        return lastValueFrom(this.svc.Create(data));
    }

    async findOne(id: string) {
        return lastValueFrom(this.svc.FindOne({ id }));
    }

    async findAll(pagination?: PaginationQueryDto, filters?: CampaignFiltersQueryDto) {
        return lastValueFrom(this.svc.FindAll({ pagination, filters }));
    }

    async update(id: string, data: Partial<UpdateCampaignDto>) {
        return lastValueFrom(this.svc.Update({ id, ...data }));
    }

    async delete(id: string) {
        return lastValueFrom(this.svc.Delete({ id }));
    }
}