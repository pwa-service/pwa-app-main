import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
    IsArray,
    ValidateNested,
    IsEnum,
    IsNumber
} from 'class-validator';
import { PwaAppStatus } from "../enum/pwa-status.enum";
import { Type } from 'class-transformer';

export type EventType = "page_view" | "registration" | "deposit";

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
    events!: EventType[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    destinationUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    productUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    rating?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    adsText?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    categorySubtitle?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    reviewsCount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    reviewsCountLabel?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    appSize?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    appSizeLabel?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    installCount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    installCountLabel?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    ageLimit?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    ageLimitLabel?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    iconUrl?: string;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsString({ each: true })
    galleryUrls?: string[];
}