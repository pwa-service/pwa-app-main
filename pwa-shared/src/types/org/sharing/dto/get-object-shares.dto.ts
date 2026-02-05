import { IsUUID } from 'class-validator';

export class GetObjectSharesDto {
    @IsUUID()
    workingObjectId: string;
}