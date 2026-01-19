import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class SignUpDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail({}, { message: 'Email must be valid' })
    email!: string;

    @ApiProperty({ example: 'supersecret' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password!: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    username!: string;
}
