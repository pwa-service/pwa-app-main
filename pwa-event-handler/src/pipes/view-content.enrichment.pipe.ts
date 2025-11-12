import { Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {EventMeta, FbEventEnum} from '../../../pwa-shared/src';

type AnyEventDto = {
    event: FbEventEnum;
    pwaDomain: string;
    landingUrl?: string;
    queryStringRaw?: string;
    sessionId?: string;
    pixelId?: number;
    value?: string;
    currency?: string;
} & { _meta: EventMeta };


@Injectable()
export class ViewContentEnrichmentPipe
    implements PipeTransform<AnyEventDto, AnyEventDto> {

    transform(value: AnyEventDto): AnyEventDto {
        const params = this.getSearchParams(value);
        const _meta: EventMeta = {
            clientIp: value._meta.clientIp,
            userAgent: value._meta.userAgent,
            sessionId: value.sessionId,
            pwaDomain: value.pwaDomain,
            value: value.value ? parseFloat(value.value) : undefined,
            currency: value.currency,
            pixelId: value.pixelId ? value.pixelId : "",
            fbclid: params.get('fbclid') || undefined,
            offerId: params.get('offer_id') || undefined,
            utmSource: params.get('utm_source') || undefined,
            sub1: params.get('sub1') || undefined,
        };

        return Object.assign(value, { _meta });
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