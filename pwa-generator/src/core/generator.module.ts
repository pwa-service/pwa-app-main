import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorCoreService } from './generator.core.service';
import {GeneratorQueueModule} from "../bullmq/generator.queue.module";
import {PrismaModule} from "../../../pwa-prisma/src";
import {GeneratorRepository} from "./generator.repository";

@Module({
    imports: [PrismaModule, GeneratorQueueModule],
    controllers: [GeneratorController],
    providers: [
        GeneratorCoreService,
        GeneratorRepository
    ],
})
export class GeneratorModule {}