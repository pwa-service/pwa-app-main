import { IsString, IsUUID, IsOptional, Length } from 'class-validator';

export class UpdateTeamDto {
    @IsUUID()
    id: string;

    @IsOptional()
    @IsString()
    @Length(3, 50)
    name?: string;

    @IsOptional()
    @IsUUID()
    leadId?: string;
}