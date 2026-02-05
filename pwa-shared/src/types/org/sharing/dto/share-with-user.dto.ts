import { IsUUID, IsDateString, IsOptional } from 'class-validator';

export class ShareWithUserDto {
    @IsUUID()
    workingObjectId: string;

    @IsUUID()
    targetUserProfileId: string;

    @IsUUID()
    accessProfileId: string;

    @IsUUID()
    createdByUserProfileId: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}