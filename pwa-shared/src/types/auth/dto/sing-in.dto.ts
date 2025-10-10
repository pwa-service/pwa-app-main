import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class SignInDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'supersecret' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: 'John' })
    @IsOptional()
    @IsString()
    otp?: string;
}