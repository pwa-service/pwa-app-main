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
    author?: string;
    rating?: string;
    adsText?: string;
    category?: string;
    categorySubtitle?: string;
    reviewsCount?: number;
    reviewsCountLabel?: string;
    appSize?: number;
    appSizeLabel?: string;
    installCount?: number;
    installCountLabel?: string;
    ageLimit?: number;
    ageLimitLabel?: string;
    iconUrl?: string;
    galleryUrls?: string[];
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

export interface DeleteAppPayload {
    appId: string;
    domain: string;
    domainId?: string;
}