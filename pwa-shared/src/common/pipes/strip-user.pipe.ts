import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class StripUserPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value || typeof value !== 'object') {
            return value;
        }

        if ('user' in value) {
            const { user, ...cleanData } = value;
            return cleanData;
        }

        return value;
    }
}