import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetAppDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}