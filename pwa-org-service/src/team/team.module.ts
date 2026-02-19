import { Module } from '@nestjs/common';
import { TeamGrpcController } from './team.grpc.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { PrismaModule } from '../../../pwa-prisma/src';
import { RoleModule } from '../roles/role.module';
import { CampaignModule } from '../campaign/campaign.module';
import { IsCampaignExists } from '../common/pipes/is-campaign-exists.pipe';
import { IsTeamExists } from '../common/pipes/is-team-exists.pipe';
import { IsLeadBelongsToCampaignInterceptor } from '../common/interceptors/is-lead-belongs-to-campaign.interceptor';
import { IsUserProfileExists } from '../common/pipes/is-user-profile-exists.pipe';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";


const AUTH_PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos')
@Module({
    imports: [
        PrismaModule,
        RoleModule,
        CampaignModule,
        ClientsModule.register([
            {
                name: 'AUTH_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'auth.v1',
                    protoPath: join(AUTH_PROTO_DIR, 'auth.proto'),
                    url: process.env.AUTH_SERVICE_GRPC_URL || 'localhost:50051',
                    loader: {
                        includeDirs: [AUTH_PROTO_DIR],
                        keepCase: false,
                        longs: String,
                        enums: String,
                        defaults: true,
                        oneofs: true,
                    },
                },
            },
        ]),
    ],
    controllers: [TeamGrpcController],
    providers: [
        TeamService,
        TeamRepository,
        IsCampaignExists,
        IsTeamExists,
        IsLeadBelongsToCampaignInterceptor,
        IsUserProfileExists,
    ],
    exports: [TeamService, TeamRepository],
})
export class TeamModule { }