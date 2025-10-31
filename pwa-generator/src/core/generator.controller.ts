import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { GeneratorCoreService } from './generator.core.service';
import {CreateAppDto} from "../../../pwa-shared/src";

@Controller()
export class GeneratorController {
    constructor(private readonly coreService: GeneratorCoreService) {}

    @GrpcMethod('GeneratorService', 'CreateApp')
    async createApp(@Payload() data: CreateAppDto) {
        return this.coreService.createApp(data);
    }
}