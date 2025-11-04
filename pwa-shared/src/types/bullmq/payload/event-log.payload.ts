type EventType = 'ViewContent' | 'PageView' | 'Lead' | 'CompleteRegistration' | 'Purchase' | 'Subscribe'
type LogStatus = "success" | "error"

export interface CreateEventLogPayload {
    sessionId: string;
    eventType: EventType;
    eventId: string;
    status: LogStatus;
    responseData?: any;
    country?: string | null;
    clientIp?: string | null;
    userAgent?: string | null;
    revenue?: number | null;
}