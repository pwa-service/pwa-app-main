import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from "@grpc/grpc-js";
import { CreateMemberDto } from "../../../../pwa-shared/src";
import { CreateCampaignMemberDto } from "../../../../pwa-shared/src/types/org/member/dto/create-campaign.dto";

interface IMemberGrpcService {
    GetMyProfile(data: { id: string }, md?: Metadata): Observable<any>;
    GetMyStats(data: { id: string }, md?: Metadata): Observable<any>;
    CreateCampaignMember(data: CreateCampaignMemberDto, md?: Metadata): Observable<any>;
    CreateTeamLead(data: CreateMemberDto, md?: Metadata): Observable<any>;
    CreateTeamMember(data: CreateMemberDto, md?: Metadata): Observable<any>;
}

@Injectable()
export class MemberGrpcClient implements OnModuleInit {
    private svc: IMemberGrpcService;

    constructor(@Inject('ORG_SERVICE_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<IMemberGrpcService>('MemberService');
    }

    async getMyProfile(id: string) {
        return lastValueFrom(this.svc.GetMyProfile({ id }));
    }

    async getMyStats(id: string) {
        return lastValueFrom(this.svc.GetMyStats({ id }));
    }

    async createCampaignMember(dto: CreateCampaignMemberDto) {
        return lastValueFrom(this.svc.CreateCampaignMember(dto));
    }

    async createTeamLead(dto: CreateMemberDto) {
        return lastValueFrom(this.svc.CreateTeamLead(dto));
    }

    async createTeamMember(dto: CreateMemberDto) {
        return lastValueFrom(this.svc.CreateTeamMember(dto));
    }
}