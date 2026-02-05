import { IsUUID } from 'class-validator';

export class AssignLeadDto {
    @IsUUID()
    teamId: string;

    @IsUUID()
    userId: string;
}