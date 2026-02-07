import { IsUUID, IsEnum } from 'class-validator';
import {ShareType} from "../enums/access.enum";

export class RevokeShareDto {
    @IsUUID()
    shareId!: string;

    @IsEnum(ShareType)
    type!: ShareType;
}