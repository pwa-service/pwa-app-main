import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from "@grpc/grpc-js";
import {
    ShareWithRoleDto,
    ShareWithUserDto,
    GetObjectSharesDto,
    RevokeShareDto
} from "../../../../pwa-shared/src";

interface ISharingGrpcService {
    ShareWithRole(data: ShareWithRoleDto, md?: Metadata): Observable<any>;
    ShareWithUser(data: ShareWithUserDto, md?: Metadata): Observable<any>;
    GetObjectShares(data: GetObjectSharesDto, md?: Metadata): Observable<any>;
    RevokeShare(data: RevokeShareDto, md?: Metadata): Observable<any>;
}

@Injectable()
export class SharingGrpcClient implements OnModuleInit {
    private svc: ISharingGrpcService;

    constructor(@Inject('ORG_SERVICE_GRPC') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<ISharingGrpcService>('SharingService');
    }

    async shareWithRole(data: ShareWithRoleDto) {
        return lastValueFrom(this.svc.ShareWithRole(data));
    }

    async shareWithUser(data: ShareWithUserDto) {
        return lastValueFrom(this.svc.ShareWithUser(data));
    }

    async getObjectShares(workingObjectId: string) {
        return lastValueFrom(this.svc.GetObjectShares({ workingObjectId }));
    }

    async revokeShare(data: RevokeShareDto) {
        return lastValueFrom(this.svc.RevokeShare(data));
    }
}