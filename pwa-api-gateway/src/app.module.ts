import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {authClient, eventHandlerClient, generatorClient} from './common/grpc.factory';
import { AuthHttpController } from './auth/auth.http.controller';
import { AuthGrpcClient } from './auth/auth.grpc.client';
import { ClientIpMiddleware } from "./common/middlewares/client-ip.middleware";
import {EventHandlerHttpController} from "./event-handler/event-handler.http.controller";
import {EventHandlerGrpcClient} from "./event-handler/event-handler.grpc.client";
import {GeneratorHttpController} from "./generator/generator.http.controller";
import {GeneratorGrpcClient} from "./generator/generator.grpc.client";

@Module({
    imports: [ClientsModule.register([authClient, eventHandlerClient, generatorClient])],
    controllers: [AuthHttpController, EventHandlerHttpController, GeneratorHttpController],
    providers: [AuthGrpcClient, EventHandlerGrpcClient, GeneratorGrpcClient],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(ClientIpMiddleware)
        .forRoutes('api/pwa');
    }
}
