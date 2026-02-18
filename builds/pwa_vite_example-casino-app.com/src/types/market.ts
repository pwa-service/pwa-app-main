export interface ImageData {
  src: string;
  alt: string;
}

export interface SummaryData {
  id: number;
  value: string | null;
  label: string;
  icon: string | null;
  description?: string;
}

export interface ReviewsData {
  rating: number;
  reviews: string;
  percentA: number;
  percentB: number;
  percentC: number;
  percentD: number;
  percentE: number;
}

export interface GoogleCommentData {
  id: number;
  type: "user" | "support";
  fullName: string;
  date: string;
  text: string;
}

export interface AppleCommentData {
  id: number;
  fullName: string;
  date: string;
  text: string;
}
