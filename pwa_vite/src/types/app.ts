export type StatusType = "draft" | "published" | "archived";
export type EventType = "page_view" | "registration" | "deposit";

export interface Comment {
  author: string;
  text: string;
}

export interface LabelItem {
  text: string;
}

export interface PwaAppData {
  domainId: string;
  status: StatusType;
  lang: string;

  destinationUrl: string;
  productUrl: string;

  name: string;
  description: string;
  author: string;

  rating: string;
  adsText: string;
  category: string;
  categorySubtitle: string;

  reviewsCount: number;
  reviewsCountLabel: string;

  appSize: number;
  appSizeLabel: string;

  installCount: number;
  installCountLabel: string;

  ageLimit: number;
  ageLimitLabel: string;

  comments: Comment[];
  terms: LabelItem[];
  tags: LabelItem[];
  events: EventType[];
}
