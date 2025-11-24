export interface ImageData {
  src: string;
  alt: string;
}

export interface ProductSummaryData {
  id: number;
  value: string | null;
  label: string;
  icon: string | null;
  description?: string;
}

export interface GoogleCommentData {
  id: number;
  type: "user" | "support";
  avatar?: ImageData;
  fullName: string;
  date: string;
  starImage?: ImageData;
  text: string;
}

export interface AppleCommentData {
  id: number;
  fullName: string;
  starsImage: ImageData;
  date: string;
  text: string;
}
