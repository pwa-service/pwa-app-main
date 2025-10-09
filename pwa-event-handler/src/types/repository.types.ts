import {EventType, LogStatus} from '.prisma/client';

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