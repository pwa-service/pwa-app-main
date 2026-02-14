import { PartialType, OmitType } from '@nestjs/swagger';
import {CreateTeamMemberDto} from "./create-team-member.dto";

export class UpdateMemberDto extends PartialType(
    OmitType(CreateTeamMemberDto, ['campaignId', 'teamId', 'username'] as const),
) {
    id: string;
}