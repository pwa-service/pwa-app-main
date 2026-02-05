import { IsInt, IsUUID } from 'class-validator';

export class SetGlobalRoleAccessDto {
    @IsInt()
    roleId: number;

    @IsUUID()
    accessProfileId: string;
}