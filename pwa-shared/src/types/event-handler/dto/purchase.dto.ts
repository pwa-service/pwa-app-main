import {IsNumber, IsOptional, IsPositive, IsString, IsUrl} from "class-validator";

export class PurchaseDto {
    @IsString() userId!: string;
    @IsString() pwaDomain!: string;
    @IsOptional() @IsUrl({ require_protocol: true }) landingUrl?: string;
    @IsOptional() queryStringRaw?: string;

    @IsNumber() @IsPositive() value!: number;
    @IsString() currency!: string;
}
