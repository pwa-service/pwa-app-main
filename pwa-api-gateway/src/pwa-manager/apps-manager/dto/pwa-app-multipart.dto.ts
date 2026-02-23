import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PwaAppStatus } from '../../../../../pwa-shared/src/types/pwa-manager/apps-manager/enum/pwa-status.enum';

export class CreateAppMultipartDto {
    @ApiProperty({ type: 'string' })
    name!: string;

    @ApiProperty({ type: 'string' })
    domainId!: string;

    @ApiProperty({
        enum: PwaAppStatus,
        example: PwaAppStatus.DRAFT,
        type: 'string'
    })
    status!: PwaAppStatus;

    @ApiProperty({ required: false, type: 'string' })
    description?: string;

    @ApiProperty({ type: 'string', example: '[{"author": "Admin", "text": "Comment"}]', description: 'JSON string of comments' })
    comments!: string;

    @ApiProperty({ type: 'string', example: 'en' })
    lang!: string;

    @ApiProperty({ type: 'string', example: '[{"text": "Terms..."}]', description: 'JSON string of terms' })
    terms!: string;

    @ApiProperty({ type: 'string', example: '[{"text": "tag1"}]', description: 'JSON string of tags' })
    tags!: string;

    @ApiProperty({ type: 'string', example: '["page_view", "registration"]', description: 'JSON string of event types' })
    events!: string;

    @ApiProperty({ required: false, type: 'string' })
    destinationUrl?: string;

    @ApiProperty({ required: false, type: 'string' })
    productUrl?: string;

    @ApiProperty({ required: false, type: 'string' })
    author?: string;

    @ApiProperty({ required: false, type: 'string' })
    rating?: string;

    @ApiProperty({ required: false, type: 'string' })
    adsText?: string;

    @ApiProperty({ required: false, type: 'string' })
    category?: string;

    @ApiProperty({ required: false, type: 'string' })
    categorySubtitle?: string;

    @ApiProperty({ required: false, type: 'number' })
    reviewsCount?: number;

    @ApiProperty({ required: false, type: 'string' })
    reviewsCountLabel?: string;

    @ApiProperty({ required: false, type: 'number' })
    appSize?: number;

    @ApiProperty({ required: false, type: 'string' })
    appSizeLabel?: string;

    @ApiProperty({ required: false, type: 'number' })
    installCount?: number;

    @ApiProperty({ required: false, type: 'string' })
    installCountLabel?: string;

    @ApiProperty({ required: false, type: 'number' })
    ageLimit?: number;

    @ApiProperty({ required: false, type: 'string' })
    ageLimitLabel?: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Icon image file' })
    icon?: any;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false, description: 'Gallery image files' })
    gallery?: any[];
}

export class UpdateAppMultipartDto extends PartialType(CreateAppMultipartDto) { }
