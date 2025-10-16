import { CampaignParams, MonetaryParams, DeviceContext, Timing } from '../common.types';

export type BasePayload = {
    sourceUrl: string;
    userId: string;
} & CampaignParams & DeviceContext & Timing;

export type ViewContentPayload            = BasePayload & { eventName: 'ViewContent' };
export type PageViewPayload               = BasePayload & { eventName: 'PageView' };
export type LeadPayload                   = BasePayload & { eventName: 'Lead' };
export type CompleteRegistrationPayload   = BasePayload & { eventName: 'CompleteRegistration' };
export type PurchasePayload               = (BasePayload & MonetaryParams) & { eventName: 'Purchase' };
export type SubscribePayload              = (BasePayload & MonetaryParams) & { eventName: 'Subscribe' };

export type FBPayload =
    | ViewContentPayload
    | PageViewPayload
    | LeadPayload
    | CompleteRegistrationPayload
    | PurchasePayload
    | SubscribePayload;

export type EventMeta = {
    pixelId: string;
    clientIp: string;
    userAgent: string;
} & Pick<CampaignParams, 'fbclid' | 'offerId' | 'utmSource'>;
