import { Module } from '@nestjs/common';
import { TeamGrpcController } from './team.grpc.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { PrismaModule } from '../../../pwa-prisma/src';

@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [TeamGrpcController],
    providers: [TeamService, TeamRepository],
    exports: [TeamService, TeamRepository],
})
export class TeamModule {}