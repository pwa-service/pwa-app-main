import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
    appsManager,
    authClient,
    orgClient,
    eventHandlerClient,
    pixelTokenManager,
    domainManager
} from './common/grpc.factory';
import { AuthHttpController } from './auth/auth.http.controller';
import { AuthGrpcClient } from './auth/auth.grpc.client';
import { ClientIpMiddleware } from "./common/middlewares/client-ip.middleware";
import { EventHandlerHttpController } from "./event-handler/event-handler.http.controller";
import { EventHandlerGrpcClient } from "./event-handler/event-handler.grpc.client";
import { PwaManagerHttpController } from "./pwa-manager/apps-manager/pwa-manager.http.controller";
import { PwaManagerGrpcClient } from "./pwa-manager/apps-manager/pwa-manager.grpc.client";
import { PixelTokenHttpController } from "./pwa-manager/pixel-token-manager/pixel-token.http.controller";
import { PixelTokenGrpcClient } from "./pwa-manager/pixel-token-manager/pixel-token.grpc.client";
import { CampaignGrpcClient } from "./org/campaign/campaign.grpc.client";
import { CampaignHttpController } from "./org/campaign/campaign.http.controller";
import { MemberGrpcClient } from "./org/member/member.grpc.client";
import { MemberHttpController } from "./org/member/member.http.controller";
import { RoleGrpcClient } from "./org/roles/role.grpc.client";
import { RoleHttpController } from "./org/roles/role.http.controller";
import { TeamHttpController } from "./org/team/team.http.controller";
import { SharingHttpController } from "./org/sharing/sharing.http.controller";
import { TeamGrpcClient } from "./org/team/team.grpc.client";
import { SharingGrpcClient } from "./org/sharing/sharing.grpc.client";
import { DomainHttpController } from "./domain-manager/domain-manager.http.controller";
import { DomainGrpcClient } from "./domain-manager/domain-manager.grpc.client";
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    imports: [
        ClientsModule.register([authClient, eventHandlerClient, appsManager, pixelTokenManager, orgClient, domainManager]),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
    ],
    controllers: [
        AuthHttpController,
        EventHandlerHttpController,
        PwaManagerHttpController,
        PixelTokenHttpController,
        MemberHttpController,
        CampaignHttpController,
        RoleHttpController,
        TeamHttpController,
        SharingHttpController,
        DomainHttpController
    ],
    providers: [
        AuthGrpcClient,
        EventHandlerGrpcClient,
        PwaManagerGrpcClient,
        PixelTokenGrpcClient,
        CampaignGrpcClient,
        MemberGrpcClient,
        RoleGrpcClient,
        TeamGrpcClient,
        DomainGrpcClient,
        SharingGrpcClient,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ClientIpMiddleware)
            .forRoutes('api/pwa');
    }
}
