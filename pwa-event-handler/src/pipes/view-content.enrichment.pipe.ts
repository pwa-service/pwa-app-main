import { Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ViewContentDto } from "../../../pwa-shared/src/types/event-handler/dto/view-content.dto";
import {ViewContentMeta} from "../types/capi.types";


@Injectable()
export class ViewContentEnrichmentPipe
    implements PipeTransform<ViewContentDto, ViewContentDto & { _meta: ViewContentMeta }>
{
    transform(value: ViewContentDto): ViewContentDto & { _meta: ViewContentMeta } {
        if (!value.queryStringRaw) throw new RpcException('queryStringRaw is required!');
        const searchParams = new URLSearchParams(value.queryStringRaw);

        const pixelId = searchParams.get('pixel_id');
        if (!pixelId) throw new RpcException('pixel_id is required');

        const accessToken = process.env[`FB_TOKEN_${pixelId}`] ?? "testtest";
        if (!accessToken) throw new RpcException('No access token found for provided pixel_id');

        const _meta: ViewContentMeta = {
            pixelId,
            accessToken,
            fbclid: searchParams.get('fbclid') || undefined,
            offerId: searchParams.get('offer_id') || undefined,
            utmSource: searchParams.get('utm_source') || undefined,
        };

        return Object.assign(value, { _meta });
    }
}
