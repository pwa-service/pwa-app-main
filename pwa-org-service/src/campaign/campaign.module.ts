import { Module } from '@nestjs/common';
import {GrpcAuthModule} from "../../../pwa-shared/src/modules/auth/grpc-auth.module";
import {GrpcAuthInterceptor} from "../../../pwa-shared/src";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {join} from "path";
import {IsCampaignExistsInterceptor} from "../common/interceptors/is-campaign-exists.interceptor";
import {CampaignGrpcController} from "./campaign.grpc.controller";
import {CampaignService} from "./campaign.service";
import {CampaignRepository} from "./campaign.repository";
import {PrismaModule} from "../../../pwa-prisma/src";
import {RoleModule} from "../roles/role.module";
import {SharingModule} from "../sharing/sharing.module";



const AUTH_PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos')
@Module({
    imports: [
        GrpcAuthModule,
        PrismaModule,
        RoleModule,
        SharingModule,
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
    controllers: [CampaignGrpcController],
    providers: [
        CampaignService,
        CampaignRepository,
    ],
    exports: [CampaignService, CampaignRepository],
})
export class CampaignModule {}