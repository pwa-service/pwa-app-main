import { PartialType, OmitType } from '@nestjs/swagger';
import {CreateCampaignMemberDto} from "./create-member.dto";

export class UpdateMemberDto extends PartialType(
    OmitType(CreateCampaignMemberDto, ['campaignId', 'teamId', 'username'] as const),
) {
    id: string;
}