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
