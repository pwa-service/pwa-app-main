import { IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class PrepareInstallLinkDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    pwaDomain: string;
}
