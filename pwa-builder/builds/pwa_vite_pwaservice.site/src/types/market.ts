export interface IImageData {
  src: string;
  alt: string;
}

export interface IProductSummaryData {
  id: number;
  value: string | null;
  label: string;
  icon: string | null;
  description?: string;
}

export interface IGoogleCommentsData {
  id: number;
  type: "user" | "support";
  avatar?: IImageData;
  fullName: string;
  date: string;
  starImage?: IImageData;
  text: string;
}

export interface IAppleCommentsData {
  id: number;
  fullName: string;
  starsImage: IImageData;
  date: string;
  text: string;
}
