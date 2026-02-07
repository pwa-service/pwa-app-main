import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from "@grpc/grpc-js";
import {
    CreateTeamDto,
    UpdateTeamDto,
    AddMemberDto,
    RemoveMemberDto,
    AssignLeadDto,
    PaginationQueryDto
} from "../../../../pwa-shared/src";
import { TeamFilterQueryDto } from "../../../../pwa-shared/src/types/org/team/dto/filter-query.dto";

interface ITeamGrpcService {
    Create(data: CreateTeamDto, md?: Metadata): Observable<any>;
    FindOne(data: { id: string }, md?: Metadata): Observable<any>;
    FindAll(data: { pagination?: PaginationQueryDto, filters?: TeamFilterQueryDto }, md?: Metadata): Observable<any>;
    Update(data: UpdateTeamDto, md?: Metadata): Observable<any>;
    Delete(data: { id: string }, md?: Metadata): Observable<any>;
    AddMemberToTeam(data: AddMemberDto, md?: Metadata): Observable<any>;
    RemoveMember(data: RemoveMemberDto, md?: Metadata): Observable<any>;
    AssignTeamLead(data: AssignLeadDto, md?: Metadata): Observable<any>;
}

@Injectable()
export class TeamGrpcClient implements OnModuleInit {
    private svc!: ITeamGrpcService;

    constructor(@Inject('ORG_SERVICE_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<ITeamGrpcService>('TeamService');
    }

    async create(data: CreateTeamDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.Create(data, metadata));
    }

    async findOne(id: string, metadata?: Metadata) {
        return lastValueFrom(this.svc.FindOne({ id }, metadata));
    }

    async findAll(pagination?: PaginationQueryDto, filters?: TeamFilterQueryDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.FindAll({ pagination, filters }, metadata));
    }

    async update(id: string, data: Partial<UpdateTeamDto>, metadata?: Metadata) {
        return lastValueFrom(this.svc.Update({ id, ...data } as UpdateTeamDto, metadata));
    }

    async delete(id: string, metadata?: Metadata) {
        return lastValueFrom(this.svc.Delete({ id }, metadata));
    }

    async addMember(data: AddMemberDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.AddMemberToTeam(data, metadata));
    }

    async removeMember(data: RemoveMemberDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.RemoveMember(data, metadata));
    }

    async assignTeamLead(data: AssignLeadDto, metadata?: Metadata) {
        return lastValueFrom(this.svc.AssignTeamLead(data, metadata));
    }
}