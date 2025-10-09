import { Module } from '@nestjs/common';
import {BullmqModule} from "./core/bullmq/bullmq.module";

@Module({
    imports: [BullmqModule],
})
export class AppModule {}
