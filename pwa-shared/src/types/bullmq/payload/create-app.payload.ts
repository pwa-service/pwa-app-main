export interface AppConfig {
    name: string;
    lang: string;
    description?: string;
    terms: { text: string }[];
    comments: { author: string; text: string }[];
    tags: { text: string }[];
    events: string[];
    destinationUrl?: string;
    productUrl?: string;
}

export class CreateAppPayload {
    domain!: string;
    appId?: string;
    config?: AppConfig;
}

export interface BuildFinishedPayload {
    appId: string;
    status: string;
    error?: string;
}