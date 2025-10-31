import { Module } from '@nestjs/common';
import {GeneratorModule} from "./core/generator.module";

@Module({
    imports: [GeneratorModule],
})
export class AppModule {}