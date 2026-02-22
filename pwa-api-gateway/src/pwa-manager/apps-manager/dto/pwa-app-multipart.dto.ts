import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PwaAppStatus } from '../../../../../pwa-shared/src/types/pwa-manager/apps-manager/enum/pwa-status.enum';

export class CreateAppMultipartDto {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    domainId!: string;

    @ApiProperty({
        enum: PwaAppStatus,
        example: PwaAppStatus.DRAFT
    })
    status!: PwaAppStatus;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty({ example: '[{"author": "Admin", "text": "Comment"}]', description: 'JSON string of comments' })
    comments!: string;

    @ApiProperty({ example: 'en' })
    lang!: string;

    @ApiProperty({ example: '[{"text": "Terms..."}]', description: 'JSON string of terms' })
    terms!: string;

    @ApiProperty({ example: '[{"text": "tag1"}]', description: 'JSON string of tags' })
    tags!: string;

    @ApiProperty({ example: '["page_view", "registration"]', description: 'JSON string of event types' })
    events!: string;

    @ApiProperty({ required: false })
    destinationUrl?: string;

    @ApiProperty({ required: false })
    productUrl?: string;

    @ApiProperty({ required: false })
    author?: string;

    @ApiProperty({ required: false })
    rating?: string;

    @ApiProperty({ required: false })
    adsText?: string;

    @ApiProperty({ required: false })
    category?: string;

    @ApiProperty({ required: false })
    categorySubtitle?: string;

    @ApiProperty({ required: false, type: 'number' })
    reviewsCount?: number;

    @ApiProperty({ required: false })
    reviewsCountLabel?: string;

    @ApiProperty({ required: false, type: 'number' })
    appSize?: number;

    @ApiProperty({ required: false })
    appSizeLabel?: string;

    @ApiProperty({ required: false, type: 'number' })
    installCount?: number;

    @ApiProperty({ required: false })
    installCountLabel?: string;

    @ApiProperty({ required: false, type: 'number' })
    ageLimit?: number;

    @ApiProperty({ required: false })
    ageLimitLabel?: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Icon image file' })
    icon?: any;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false, description: 'Gallery image files' })
    gallery?: any[];
}

export class UpdateAppMultipartDto extends PartialType(CreateAppMultipartDto) { }
