import {IsNumber, IsOptional, IsPositive, IsString, IsUrl} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class PurchaseDto {
    @ApiProperty()
    @IsString()
    userId!: string;

    @ApiProperty()
    @IsString()
    pwaDomain!: string;

    @ApiProperty()
    @IsOptional()
    @IsUrl({ require_protocol: true })
    landingUrl?: string;

    @ApiProperty()
    @IsOptional()
    queryStringRaw?: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    value!: number;

    @ApiProperty()
    @IsString()
    @ApiProperty()
    currency!: string;
}
