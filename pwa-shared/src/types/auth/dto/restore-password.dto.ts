import { IsEmail } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class RestorePasswordDto {
    @ApiProperty({ example: '12345' })
    @IsEmail()
    newPassword!: string;
}