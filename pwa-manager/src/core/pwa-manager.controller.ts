import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { PwaManagerCoreService } from './pwa-manager.core.service';
import { CreateAppDto, UpdateAppDto, GrpcAuthInterceptor, PaginationQueryDto, PwaAppFiltersQueryDto } from "../../../pwa-shared/src";
import { UserPayload } from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import { GrpcUser } from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import { IsDomainExists } from '../common/pipes/is-domain-exists.pipe';

@Controller()
@UseInterceptors(GrpcAuthInterceptor)
export class PwaManagerController {
    constructor(private readonly coreService: PwaManagerCoreService) { }

    @GrpcMethod('PwaAppsManagerService', 'CreateApp')
    async createApp(@Payload(IsDomainExists) data: CreateAppDto, @GrpcUser() user: UserPayload) {
        return this.coreService.createApp(data, user);
    }

    @GrpcMethod('PwaAppsManagerService', 'GetAppById')
    async getAppById(@Payload() data: { app_id: string }) {
        return this.coreService.getApp(data.app_id);
    }

    @GrpcMethod('PwaAppsManagerService', 'FindAll')
    async findAll(@Payload() data: { pagination: PaginationQueryDto; filters?: PwaAppFiltersQueryDto }) {
        return this.coreService.getAllApps(data.pagination, data.filters);
    }

    @GrpcMethod('PwaAppsManagerService', 'UpdateApp')
    async updateApp(@Payload() data: UpdateAppDto & { id: string }) {
        const { id, ...updateDto } = data;
        return this.coreService.updateApp(id, updateDto);
    }

    @GrpcMethod('PwaAppsManagerService', 'DeleteApp')
    async deleteApp(@Payload() data: { id: string }) {
        return this.coreService.deleteApp(data.id);
    }
}