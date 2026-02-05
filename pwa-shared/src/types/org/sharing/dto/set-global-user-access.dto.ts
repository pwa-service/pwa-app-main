import { IsUUID } from 'class-validator';

export class SetGlobalUserAccessDto {
    @IsUUID()
    targetUserId: string;

    @IsUUID()
    accessProfileId: string;
}