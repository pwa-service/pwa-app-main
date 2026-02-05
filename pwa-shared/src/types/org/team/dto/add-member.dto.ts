import { IsInt, IsUUID } from 'class-validator';

export class AddMemberDto {
    @IsUUID()
    teamId: string;

    @IsUUID()
    userId: string;

    @IsInt()
    roleId: number;
}