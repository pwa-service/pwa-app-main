import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
    @ApiProperty({ example: 'e4r5t6y7u8i9o0p1' })
    @IsNotEmpty()
    @IsString()
    token!: string;
}