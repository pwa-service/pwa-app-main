import { Module } from '@nestjs/common';
import { BullmqModule } from "./core/bullmq/bullmq.module";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot(), BullmqModule],
})
export class AppModule {}
