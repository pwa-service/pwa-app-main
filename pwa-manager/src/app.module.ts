import { Module } from '@nestjs/common';
import {PwaManagerModule} from "./core/pwa-manager.module";

@Module({
    imports: [PwaManagerModule],
})
export class AppModule {}