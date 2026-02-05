import { Injectable, PipeTransform } from '@nestjs/common';
import {AnyEventDto, EventMeta } from '../../../../pwa-shared/src';

@Injectable()
export class ViewContentEnrichmentPipe
    implements PipeTransform<AnyEventDto, AnyEventDto> {

    transform(value: AnyEventDto): AnyEventDto {
        const params = this.getSearchParams(value);
        const pixelId = value.pixelId || params.get('pixel_id');
        const currency = value.currency === "" || value.currency === undefined || value.currency === null ? "USD" : value.currency

        const _meta: EventMeta = {
            clientIp: value._meta.clientIp,
            userAgent: value._meta.userAgent,
            sessionId: value.sessionId,
            pwaDomain: value.pwaDomain,
            value: value.value ? parseFloat(value.value) : undefined,
            pixelId: pixelId ? pixelId : "",
            fbclid: params.get('fbclid') || undefined,
            offerId: params.get('offer_id') || undefined,
            utmSource: params.get('utm_source') || undefined,
            sub1: params.get('sub1') || undefined,
        };

        return Object.assign({...value, currency }, { _meta });
    }

    private getSearchParams(v: AnyEventDto): URLSearchParams {
        if (v?.queryStringRaw) {
            return new URLSearchParams(v.queryStringRaw);
        }

        if (v?.landingUrl) {
            try {
                const url = new URL(v.landingUrl, 'https://placeholder.com');
                return url.searchParams;
            } catch (_) {
            }
        }
        return new URLSearchParams();
    }
}