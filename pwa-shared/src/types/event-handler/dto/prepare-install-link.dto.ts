import { IsString } from 'class-validator';

export class PrepareInstallLinkDto {
    @IsString()
    userId: string;

    @IsString()
    pwaDomain: string;
}
