import type { IImageData, IGoogleCommentsData, IAppleCommentsData } from "../types/market";

import starIcon from "../assets/market/google-star.svg";
import downloadsIcon from "../assets/market/google-downloads.svg";
import guardIcon from "../assets/market/google-guard.svg";
import starsIcon from "../assets/market/apple-stars.svg";
import avatarIcon from "../assets/market/default-avatar.svg";

import screen1 from "../assets/market/screen-1.png";
import screen2 from "../assets/market/screen-2.png";
import screen3 from "../assets/market/screen-3.png";
import screen4 from "../assets/market/screen-4.png";

import screen5 from "../assets/market/screen-5.png";
import screen6 from "../assets/market/screen-6.png";
import screen7 from "../assets/market/screen-7.png";
import screen8 from "../assets/market/screen-8.png";

import fiveStars from "../assets/market/google-five-stars.svg";
import fiveStarsApple from "../assets/market/apple-five-stars.svg";

import avatar1 from "../assets/market/avatar-1.svg";
import avatar2 from "../assets/market/avatar-2.svg";
import avatar3 from "../assets/market/avatar-3.svg";

export const appleProductSummary = [
  { id: 1, label: "Resenas", value: "4.8", icon: starsIcon, description: "" },
  { id: 2, label: "Age", value: "21+", icon: null, description: "Years old" },
  { id: 3, label: "Chart", value: "#1", icon: null, description: "Board" },
  {
    id: 4,
    label: "Developer",
    value: null,
    icon: avatarIcon,
    description: "BETONWIN",
  },
];

export const googleProductSummary = [
  { id: 1, label: "Resenas", value: "4.8", icon: starIcon },
  { id: 2, label: "Descargas", value: "50k+", icon: null },
  { id: 3, label: "16.5 MB", value: null, icon: downloadsIcon },
  { id: 4, label: "Eleccion del editon", value: null, icon: guardIcon },
];

export const sliderImagesV1: IImageData[] = [
  { src: screen1, alt: "screen1" },
  { src: screen2, alt: "screen2" },
  { src: screen3, alt: "screen3" },
  { src: screen4, alt: "screen4" },
];

export const sliderImagesV2: IImageData[] = [
  { src: screen5, alt: "screen1" },
  { src: screen6, alt: "screen2" },
  { src: screen7, alt: "screen3" },
  { src: screen8, alt: "screen4" },
];

export const aboutTexts: string[] = [
  "🇨🇱 Bonificación de bienvenida: DEL 700% HASTA $3,000.000 + 600 GIROS GRATIS",
  "🇨🇱 Bonificación de bienvenida: DEL 700% HASTA $3,000.000 + 600 GIROS GRATIS",
  "🇨🇱 Bonificación de bienvenida: DEL 700% HASTA $3,000.000 + 600 GIROS GRATIS",
  "🇨🇱 Bonificación de bienvenida: DEL 700% HASTA $3,000.000 + 600 GIROS GRATIS",
];

export const aboutTags: string[] = ["Casino", "Slot machine", "Casual games"];

export const googleComments: IGoogleCommentsData[] = [
  {
    id: 1,
    type: "user",
    fullName: "Alex Morgan",
    date: "July 3, 2025",
    avatar: { src: avatar1, alt: "avatar" },
    starImage: { src: fiveStars, alt: "five star" },
    text: "I can't get enough of the Ultimate Casino Experience! The game selection is vast, and the quality is unmatched. I’ve won several times, and withdrawals are swift and hassle-free. The customer service is also commendable - responsive and helpful!",
  },
  {
    id: 2,
    type: "support",
    fullName: "BETONWIN Support",
    date: "July 3, 2025",
    text: "Thank you for your kind words! We're thrilled to hear that you're enjoying your time with us. At Ultimate Casino Experience, we're committed to offering a diverse range of games, top-tier security, and exceptional customer service. We continuously strive to enhance the user experience. Happy gaming! 🎰",
  },
  {
    id: 3,
    type: "user",
    fullName: "Jordan Smith",
    date: "July 4, 2025",
    avatar: { src: avatar2, alt: "avatar" },
    starImage: { src: fiveStars, alt: "five star" },
    text: "This app is a game-changer! The user interface is intuitive, and I found my favorite games in seconds. The live casino feature makes the gaming experience immersive and social. I feel safe playing here, thanks to the top-notch security measures in place.",
  },
  {
    id: 4,
    type: "user",
    fullName: "Taylor Williams",
    date: "July 4, 2025",
    avatar: { src: avatar3, alt: "avatar" },
    starImage: { src: fiveStars, alt: "five star" },
    text: "I'm absolutely in love with the Ultimate Casino Experience app! The variety of games is astounding, and the graphics are incredibly realistic. The bonuses are generous, making the gameplay even more exciting. It feels like I have a real casino right in my pocket!",
  },
];

export const appleComments: IAppleCommentsData[] = [
  {
    id: 1,
    fullName: "Alex Morgan",
    starsImage: { src: fiveStarsApple, alt: "five stars" },
    date: "03.07.25",
    text: "I can't get enough of the Ultimate Casino Experience! The game selection is vast, and the quality is unmatched. I’ve won several times, and withdrawals are swift and hassle-free. The customer service is also commendable - responsive and helpful!",
  },
  {
    id: 2,
    fullName: "Alex Morgan",
    starsImage: { src: fiveStarsApple, alt: "five stars" },
    date: "03.07.25",
    text: "I can't get enough of the Ultimate Casino Experience! The game selection is vast, and the quality is unmatched. I’ve won several times, and withdrawals are swift and hassle-free. The customer service is also commendable - responsive and helpful!",
  },
  {
    id: 3,
    fullName: "Alex Morgan",
    starsImage: { src: fiveStarsApple, alt: "five stars" },
    date: "03.07.25",
    text: "I can't get enough of the Ultimate Casino Experience! The game selection is vast, and the quality is unmatched. I’ve won several times, and withdrawals are swift and hassle-free. The customer service is also commendable - responsive and helpful!",
  },
];
