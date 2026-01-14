import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { PwaManagerCoreService } from './pwa-manager.core.service';
import {CreateAppDto} from "../../../pwa-shared/src";

@Controller()
export class PwaManagerController {
    constructor(private readonly coreService: PwaManagerCoreService) {}

    @GrpcMethod('PixelTokenService', 'CreateApp')
    async createApp(@Payload() data: CreateAppDto) {
        return this.coreService.createApp(data);
    }
}