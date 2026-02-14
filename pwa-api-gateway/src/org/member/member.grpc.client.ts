import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from "@grpc/grpc-js";
import {
    CreateCampaignMemberDto,
    PaginationQueryDto,
    MemberFilterQueryDto,
    CreateTeamMemberDto
} from "../../../../pwa-shared/src";

interface IMemberGrpcService {
    GetMyProfile(data: { id: string }, md?: Metadata): Observable<any>;
    FindAll(data: { pagination: PaginationQueryDto, filters: MemberFilterQueryDto }, md?: Metadata): Observable<any>;
    CreateCampaignMember(data: CreateCampaignMemberDto, md?: Metadata): Observable<any>;
    CreateTeamLead(data: CreateTeamMemberDto, md?: Metadata): Observable<any>;
    CreateTeamMember(data: CreateTeamMemberDto, md?: Metadata): Observable<any>;
}

@Injectable()
export class MemberGrpcClient implements OnModuleInit {
    private svc!: IMemberGrpcService;

    constructor(@Inject('ORG_SERVICE_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<IMemberGrpcService>('MemberService');
    }

    async getMyProfile(id: string, metadata?: Metadata) {
        return lastValueFrom(this.svc.GetMyProfile({ id }, metadata));
    }

    async findAll(pagination: PaginationQueryDto, filters: MemberFilterQueryDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.FindAll({ pagination, filters }, metadata));
    }

    async createCampaignMember(dto: CreateCampaignMemberDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.CreateCampaignMember(dto, metadata));
    }

    async createTeamLead(dto: CreateTeamMemberDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.CreateTeamLead(dto, metadata));
    }

    async createTeamMember(dto: CreateTeamMemberDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.CreateTeamMember(dto, metadata));
    }
}