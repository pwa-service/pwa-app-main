import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {authGrpcClient, eventHandlerClient} from './common/grpc.factory';
import { AuthHttpController } from './auth/auth.http.controller';
import { AuthGrpcClient } from './auth/auth.grpc.client';
import { ClientIpMiddleware } from "./common/middlewares/client-ip.middleware";
import {EventHandlerHttpController} from "./event-handler/event-handler.http.controller";
import {EventHandlerGrpcClient} from "./event-handler/event-handler.grpc.client";

@Module({
    imports: [ClientsModule.register([authGrpcClient, eventHandlerClient])],
    controllers: [AuthHttpController, EventHandlerHttpController],
    providers: [AuthGrpcClient, EventHandlerGrpcClient],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(ClientIpMiddleware)
        .forRoutes('api/pwa');
    }
}
