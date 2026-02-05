import { IsUUID } from 'class-validator';

export class GetMemberDto {
    @IsUUID()
    id: string;
}