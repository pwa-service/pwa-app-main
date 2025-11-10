import { Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {EventMeta, PurchaseDto} from "../../../pwa-shared/src";

type AnyEventDto = { userId: string; pwaDomain: string; landingUrl?: string; queryStringRaw?: string } & { _meta: EventMeta };

@Injectable()
export class ViewContentEnrichmentPipe
    implements PipeTransform<AnyEventDto, AnyEventDto> {
    transform(value: AnyEventDto): AnyEventDto {
        const params = this.getSearchParams(value);
        const pixelId = params.get('pixel_id');
        if (!pixelId) throw new RpcException('pixel_id is required');
        let _meta: any = {
            pixelId: pixelId,
            sessionId: params.get('sessionId'),
            clientIp: value._meta.clientIp,
            userAgent: value._meta.userAgent,
            fbclid: params.get('fbclid') || undefined,
            pwaDomain: params.get('pwa_domain') || undefined,
            offerId: params.get('offer_id') || undefined,
            utmSource: params.get('utm_source') || undefined,
            value: params.get('value') || undefined,
            currency: params.get('currency') || undefined
        };

        return Object.assign(value, {_meta});
    }

    private getSearchParams(v: AnyEventDto): URLSearchParams | any {
        console.log(v)
        if (v?.queryStringRaw) return new URLSearchParams(v.queryStringRaw);
        if (v?.landingUrl) {
            try {
                return new URL(v.landingUrl).searchParams;
            } catch (_) {
            }
        }
        return {}
    }
}