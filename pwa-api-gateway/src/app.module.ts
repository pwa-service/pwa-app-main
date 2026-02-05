import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {appsManager, authClient, orgClient, eventHandlerClient, pixelTokenManager} from './common/grpc.factory';
import { AuthHttpController } from './auth/auth.http.controller';
import { AuthGrpcClient } from './auth/auth.grpc.client';
import { ClientIpMiddleware } from "./common/middlewares/client-ip.middleware";
import {EventHandlerHttpController} from "./event-handler/event-handler.http.controller";
import {EventHandlerGrpcClient} from "./event-handler/event-handler.grpc.client";
import {PwaManagerHttpController} from "./pwa-manager/apps-manager/pwa-manager.http.controller";
import {PwaManagerGrpcClient} from "./pwa-manager/apps-manager/pwa-manager.grpc.client";
import {PixelTokenHttpController} from "./pwa-manager/pixel-token-manager/pixel-token.http.controller";
import {PixelTokenGrpcClient} from "./pwa-manager/pixel-token-manager/pixel-token.grpc.client";
import {CampaignGrpcClient} from "./org/campaign/campaign.grpc.client";
import {CampaignHttpController} from "./org/campaign/campaign.http.controller";

@Module({
    imports: [ClientsModule.register([authClient, eventHandlerClient, appsManager, pixelTokenManager, orgClient])],
    controllers: [AuthHttpController, EventHandlerHttpController, PwaManagerHttpController, PwaManagerHttpController, PixelTokenHttpController, CampaignHttpController],
    providers: [AuthGrpcClient, EventHandlerGrpcClient, PwaManagerGrpcClient, PixelTokenGrpcClient, CampaignGrpcClient],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(ClientIpMiddleware)
        .forRoutes('api/pwa');
    }
}
