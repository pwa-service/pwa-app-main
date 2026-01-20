import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { PwaManagerCoreService } from './pwa-manager.core.service';
import {CreateAppDto} from "../../../pwa-shared/src";
import {AllowAnonymous} from "../../../pwa-shared/src/modules/auth/decorators/allow-anon.decorator";

@Controller()
export class PwaManagerController {
    constructor(private readonly coreService: PwaManagerCoreService) {}

    @AllowAnonymous()
    @GrpcMethod('PwaAppsManagerService', 'CreateApp')
    async createApp(@Payload() data: CreateAppDto) {
        return this.coreService.createApp(data);
    }
}