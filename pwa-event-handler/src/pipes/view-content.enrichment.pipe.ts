import { Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {EventMeta} from "../../../pwa-shared/src";

type AnyEventDto = { userId: string; pwaDomain: string; landingUrl?: string; queryStringRaw?: string } & { _meta: EventMeta };

@Injectable()
export class ViewContentEnrichmentPipe
    implements PipeTransform<AnyEventDto, AnyEventDto> {
    transform(value: AnyEventDto): AnyEventDto {
        const params = this.getSearchParams(value);
        const pixelId = params.get('pixel_id');

        if (!pixelId) throw new RpcException('pixel_id is required');

        let _meta: EventMeta = {
            pixelId,
            fbclid: params.get('fbclid') || undefined,
            offerId: params.get('offer_id') || undefined,
            utmSource: params.get('utm_source') || undefined,
            clientIp: value._meta.clientIp,
            userAgent: value._meta.userAgent
        };

        return Object.assign(value, {_meta});
    }

    private getSearchParams(v: AnyEventDto): URLSearchParams {
        console.log(v)
        if (v?.queryStringRaw) return new URLSearchParams(v.queryStringRaw);
        if (v?.landingUrl) {
            try {
                return new URL(v.landingUrl).searchParams;
            } catch (_) {
            }
        }
        throw new RpcException('Either queryStringRaw or landingUrl with query is required');
    }
}