import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from "@grpc/grpc-js";
import { CreateCampaignMemberDto } from "../../../../pwa-shared/src";

interface IMemberGrpcService {
    GetMyProfile(data: { id: string }, md?: Metadata): Observable<any>;
    GetMyStats(data: { id: string }, md?: Metadata): Observable<any>;
    CreateCampaignMember(data: CreateCampaignMemberDto, md?: Metadata): Observable<any>;
    CreateTeamLead(data: CreateCampaignMemberDto, md?: Metadata): Observable<any>;
    CreateTeamMember(data: CreateCampaignMemberDto, md?: Metadata): Observable<any>;
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

    async getMyStats(id: string, metadata?: Metadata) {
        return lastValueFrom(this.svc.GetMyStats({ id }, metadata));
    }

    async createCampaignMember(dto: CreateCampaignMemberDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.CreateCampaignMember(dto, metadata));
    }

    async createTeamLead(dto: CreateCampaignMemberDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.CreateTeamLead(dto, metadata));
    }

    async createTeamMember(dto: CreateCampaignMemberDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.CreateTeamMember(dto, metadata));
    }
}