import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, MinLength, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    domain!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID('4')
    createdByUserId!: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;


    @ApiProperty()
    @IsOptional()
    @IsUUID()
    appId?: string;
}