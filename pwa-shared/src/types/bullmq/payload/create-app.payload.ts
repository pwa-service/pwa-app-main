export class CreateAppPayload {
    domain!: string;
    appId?: string;
}

export interface BuildFinishedPayload {
    appId: string;
    status: string;
    error?: string;
}