import { IsUUID } from 'class-validator';

export class RemoveMemberDto {
    @IsUUID('4')
    teamId: string;

    @IsUUID('4')
    userId: string;
}