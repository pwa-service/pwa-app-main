import { EventType, LogStatus } from '@prisma/client';
import { DeviceContext, Identifiers } from './common.types';

export type InternalEventType = EventType;

export type UpsertSessionInput = {
    userId: string;
    pwaDomain: string;
    landingUrl?: string | null;
    queryStringRaw?: string | null;
    pixelId: string;
    fbclid?: string | null;
    offerId?: string | null;
    utmSource?: string | null;
    sub1?: string | null;
};

export type MarkFirstOpenInput = {
    userId: string;
    eventId?: string | null;
    fbStatus?: LogStatus | null;
    finalUrl?: string | null;
};

export type CreateEventLogInput =
    Pick<Identifiers, 'userId' | 'pixelId'> &
    Pick<DeviceContext, 'clientIp'> & {
    eventType: InternalEventType;
    eventId: string;
    revenue?: number | null;
    responseData?: any;
    status: LogStatus;
    country?: string | null;
};
