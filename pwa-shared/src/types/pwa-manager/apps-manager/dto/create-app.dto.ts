import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
    IsArray,
    ValidateNested,
    IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { PwaAppStatus } from "../enum/pwa-status.enum";


import { IsDomainExists } from '../../../../common/validators/is-domain-exists.validator';

export class TermDto {
    @ApiProperty({ example: 'Умови використання...' })
    @IsString()
    @IsNotEmpty()
    text!: string;
}

export class TagDto {
    @ApiProperty({ example: 'finance' })
    @IsString()
    @IsNotEmpty()
    text!: string;
}

export class CommentDto {
    @ApiProperty({ example: 'Media Buyer 1', description: 'Автор коментаря' })
    @IsString()
    @IsNotEmpty()
    author!: string;

    @ApiProperty({ example: 'Потрібно змінити логотип', description: 'Текст коментаря' })
    @IsString()
    @IsNotEmpty()
    text!: string;
}

export class CreateAppDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    domainId!: string;

    ownerId!: string;

    @ApiProperty({
        enum: PwaAppStatus,
        description: 'Статус додатку',
        example: PwaAppStatus.DRAFT
    })
    @IsEnum(PwaAppStatus, { message: 'status must be a valid enum value' })
    @IsNotEmpty()
    status!: PwaAppStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: [CommentDto], description: 'Масив коментарів (автор + текст)' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CommentDto)
    comments!: CommentDto[];

    @ApiProperty({ example: 'en' })
    @IsString()
    @IsNotEmpty()
    lang!: string;

    @ApiProperty({ type: [TermDto], description: 'Масив юридичних текстів' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TermDto)
    terms!: TermDto[];

    @ApiProperty({ type: [TagDto], description: 'Масив тегів для пошуку та групування' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TagDto)
    tags!: TagDto[];

    @ApiProperty({ example: ['page_view', 'registration', 'deposit'], description: 'Список подій для трекінгу', type: [String] })
    @IsArray()
    @IsString({ each: true })
    events!: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    destinationUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    productUrl?: string;
}

export class CreateAppWithValidationDto extends CreateAppDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDomainExists()
    declare domainId: string;
}