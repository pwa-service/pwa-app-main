import { Module } from '@nestjs/common';
import { LoggerModule } from "./core/logger.module";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot(), LoggerModule],
})
export class AppModule {}
