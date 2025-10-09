import { Module } from '@nestjs/common';
import {AuthServiceModule} from "./core/auth-service.module";

@Module({
    imports: [AuthServiceModule],
})
export class AppModule {}
