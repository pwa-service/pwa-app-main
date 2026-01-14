import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {appsManager, authClient, eventHandlerClient, pixelTokenManager} from './common/grpc.factory';
import { AuthHttpController } from './auth/auth.http.controller';
import { AuthGrpcClient } from './auth/auth.grpc.client';
import { ClientIpMiddleware } from "./common/middlewares/client-ip.middleware";
import {EventHandlerHttpController} from "./event-handler/event-handler.http.controller";
import {EventHandlerGrpcClient} from "./event-handler/event-handler.grpc.client";
import {PwaManagerHttpController} from "./pwa-manager/apps-manager/pwa-manager.http.controller";
import {PwaManagerGrpcClient} from "./pwa-manager/apps-manager/pwa-manager.grpc.client";
import {PixelTokenHttpController} from "./pwa-manager/pixel-token-manager/pixel-token.http.controller";
import {PixelTokenGrpcClient} from "./pwa-manager/pixel-token-manager/pixel-token.grpc.client";

@Module({
    imports: [ClientsModule.register([authClient, eventHandlerClient, appsManager, pixelTokenManager])],
    controllers: [AuthHttpController, EventHandlerHttpController, PwaManagerHttpController, PwaManagerHttpController, PixelTokenHttpController],
    providers: [AuthGrpcClient, EventHandlerGrpcClient, PwaManagerGrpcClient, PixelTokenGrpcClient],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(ClientIpMiddleware)
        .forRoutes('api/pwa');
    }
}
