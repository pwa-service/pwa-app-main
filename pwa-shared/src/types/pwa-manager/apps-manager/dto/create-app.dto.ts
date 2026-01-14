import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateAppDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    domainId!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID('4')
    ownerUserId!: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    appId?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status!: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    campaignId!: string;
}