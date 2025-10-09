import { IsString } from 'class-validator';

export class PwaFirstOpenDto {
    @IsString()
    userId: string;

    @IsString()
    pwaDomain: string;
}
