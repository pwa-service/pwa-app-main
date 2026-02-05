import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MemberService } from './member.service';
import { MemberGrpcController } from './member.controller';
import { PrismaModule } from '../../../pwa-prisma/src';
import { RoleModule } from '../roles/role.module';
import { TeamModule } from '../team/team.module';
import { CampaignModule } from '../campaign/campaign.module';
import {MemberRepository} from "./member.repository";

const AUTH_PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos')

@Module({
    imports: [
        PrismaModule,
        RoleModule,
        TeamModule,
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
    controllers: [MemberGrpcController],
    providers: [MemberService, MemberRepository],
    exports: [MemberService],
})
export class MemberModule {}