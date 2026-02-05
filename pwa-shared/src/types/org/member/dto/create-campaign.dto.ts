import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength} from "class-validator";

export class CreateCampaignMemberDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    campaignId: string;

    @IsOptional()
    @IsNumber()
    roleId?: number;
}