import { Module } from '@nestjs/common';
import { SharingGrpcController } from './sharing.grpc.controller';
import { SharingService } from './sharing.service';
import { SharingRepository } from './sharing.repository';
import {PrismaModule} from "../../../pwa-prisma/src";

@Module({
    imports: [PrismaModule],
    controllers: [SharingGrpcController],
    providers: [SharingService, SharingRepository],
    exports: [SharingService],
})
export class SharingModule {}