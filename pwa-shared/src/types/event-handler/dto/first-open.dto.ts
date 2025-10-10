import { IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class PwaFirstOpenDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    pwaDomain: string;
}
