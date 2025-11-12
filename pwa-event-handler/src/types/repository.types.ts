import {EventType, LogStatus} from '.prisma/client';

export type UpsertSessionInput = {
    sessionId?: string;
    pwaDomain: string;
    landingUrl?: string | null;
    queryStringRaw?: string | null;
    pixelId: number;
    fbclid?: string | null;
    offerId?: string | null;
    utmSource?: string | null;
    sub1?: string | null;
};

export type MarkFirstOpenInput = {
    sessionId: string;
    eventId?: string | null;
    fbStatus?: LogStatus | null;
    finalUrl?: string | null;
};