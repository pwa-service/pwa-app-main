import { Module } from '@nestjs/common';
import {EventHandlerModule} from "./core/event-handler-module";

@Module({
    imports: [EventHandlerModule],
})
export class AppModule {}
