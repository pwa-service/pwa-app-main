import { Module } from '@nestjs/common';
import {EventHandlerModule} from "./core/event-handler-module";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        EventHandlerModule
    ],
})
export class AppModule {}
