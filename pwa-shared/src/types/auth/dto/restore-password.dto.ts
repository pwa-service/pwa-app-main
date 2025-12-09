import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RestorePasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'SecureP@ss123' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    newPassword!: string;

    @ApiProperty({ example: 'a1b2c3d4e5f6g7h8' })
    @IsNotEmpty()
    @IsString()
    token!: string;
}