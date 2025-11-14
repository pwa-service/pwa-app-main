import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorCoreService } from './generator.core.service';
import {GeneratorPubSubModule} from "../bullmq/generator.queue.module";
import {PrismaModule} from "../../../pwa-prisma/src";
import {GeneratorRepository} from "./generator.repository";

@Module({
    imports: [PrismaModule, GeneratorPubSubModule],
    controllers: [GeneratorController],
    providers: [
        GeneratorCoreService,
        GeneratorRepository
    ],
})
export class GeneratorModule {}