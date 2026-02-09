import {Controller, UseInterceptors} from '@nestjs/common';
import {GrpcMethod, Payload} from '@nestjs/microservices';
import { SharingService } from './sharing.service';
import {
    ShareWithRoleDto,
    ShareWithUserDto,
    RevokeShareDto,
    GetObjectSharesDto,
    ResourceType,
    AccessLevel, GrpcAuthInterceptor
} from '../../../pwa-shared/src';
import {GlobalSharingInterceptor} from "../../../pwa-shared/src/common/interceptors/global-sharing.interceptor";
import {RequireGlobalAccess} from "../../../pwa-shared/src/common/decorators/access.decorators";


@Controller()
@UseInterceptors(GrpcAuthInterceptor, GlobalSharingInterceptor)
export class SharingGrpcController {
    constructor(private readonly service: SharingService) {}

    @GrpcMethod('SharingService', 'ShareWithRole')
    @RequireGlobalAccess(ResourceType.SHARING, AccessLevel.Manage)
    async shareWithRole(@Payload() data: ShareWithRoleDto) {
        return this.service.shareWithRole(data);
    }

    @GrpcMethod('SharingService', 'ShareWithUser')
    @RequireGlobalAccess(ResourceType.SHARING, AccessLevel.Manage)
    async shareWithUser(@Payload() data: ShareWithUserDto) {
        return this.service.shareWithUser(data);
    }

    @GrpcMethod('SharingService', 'GetObjectShares')
    @RequireGlobalAccess(ResourceType.SHARING, AccessLevel.Manage)
    async getObjectShares(@Payload() data: GetObjectSharesDto) {
        return this.service.getObjectShares(data.workingObjectId);
    }

    @GrpcMethod('SharingService', 'RevokeShare')
    @RequireGlobalAccess(ResourceType.SHARING, AccessLevel.Manage)
    async revokeShare(@Payload() data: RevokeShareDto) {
        return this.service.revokeShare(data.shareId, data.type);
    }
}