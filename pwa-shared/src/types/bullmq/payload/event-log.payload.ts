type EventType = 'ViewContent' | 'PageView' | 'Lead' | 'CompleteRegistration' | 'Purchase' | 'Subscribe'
type LogStatus = "success" | "error"

export interface CreateEventLogPayload {
    userId: string;
    pixelId: string;
    eventType: EventType;
    eventId: string;
    status: LogStatus;
    responseData?: any;
    country?: string | null;
    clientIp?: string | null;
    revenue?: number | null;
}