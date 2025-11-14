export class CreateAppPayload {
    domain: string;
    appId?: string;
}

export interface BuildFinishedPayload {
    appId: string;
    Status: string;
    Error?: string;
}