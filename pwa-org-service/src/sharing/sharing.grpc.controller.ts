import {Controller, UseInterceptors, UsePipes, ValidationPipe} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SharingService } from './sharing.service';
import {
    ShareWithRoleDto,
    ShareWithUserDto,
    RevokeShareDto,
    GetObjectSharesDto, ResourceType,
} from '../../../pwa-shared/src';
import {GlobalSharingInterceptor} from "../../../pwa-shared/src/common/interceptors/global-sharing.interceptor";
import {RequireGlobalAccess} from "../../../pwa-shared/src/common/decorators/access.decorators";
import {AccessLevel} from "@prisma/client";


@Controller()
@UseInterceptors(GlobalSharingInterceptor)
export class SharingGrpcController {
    constructor(private readonly service: SharingService) {}

    @GrpcMethod('SharingService', 'ShareWithRole')
    @RequireGlobalAccess(ResourceType.SHARING, AccessLevel.Manage)
    async shareWithRole(data: ShareWithRoleDto) {
        return this.service.shareWithRole(data);
    }

    @GrpcMethod('SharingService', 'ShareWithUser')
    @RequireGlobalAccess(ResourceType.SHARING, AccessLevel.Manage)
    async shareWithUser(data: ShareWithUserDto) {
        return this.service.shareWithUser(data);
    }

    @GrpcMethod('SharingService', 'GetObjectShares')
    @RequireGlobalAccess(ResourceType.SHARING, AccessLevel.Manage)
    async getObjectShares(data: GetObjectSharesDto) {
        return this.service.getObjectShares(data.workingObjectId);
    }

    @GrpcMethod('SharingService', 'RevokeShare')
    @RequireGlobalAccess(ResourceType.SHARING, AccessLevel.Manage)
    async revokeShare(data: RevokeShareDto) {
        return this.service.revokeShare(data.shareId, data.type);
    }
}