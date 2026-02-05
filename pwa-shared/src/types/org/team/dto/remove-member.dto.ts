import { IsUUID } from 'class-validator';

export class RemoveMemberDto {
    @IsUUID()
    teamId: string;

    @IsUUID()
    userId: string;
}