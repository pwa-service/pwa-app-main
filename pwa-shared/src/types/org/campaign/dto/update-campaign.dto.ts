import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";
import {CreateCampaignDto} from "./create-campaign.dto";

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
    id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    status?: string;
}