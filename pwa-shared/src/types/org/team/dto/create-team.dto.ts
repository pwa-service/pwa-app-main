import { IsString, IsUUID, IsOptional, Length } from 'class-validator';

export class CreateTeamDto {
    @IsString()
    @Length(3, 50)
    name: string;

    @IsUUID()
    campaignId: string;

    @IsOptional()
    @IsUUID()
    leadId?: string;
}