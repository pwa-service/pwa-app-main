export type CampaignParams = {
    fbclid?: string;
    fbp?: string;
    offerId?: string;
    utmSource?: string;
};

export type MonetaryParams = {
    value?: number;
    currency?: string;
};

export type DeviceContext = {
    clientIp?: string;
    userAgent?: string;
};

export type Timing = {
    eventTime?: number;
    eventId?: string;
};
