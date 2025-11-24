import type { AppleCommentData, GoogleCommentData } from "../types/market";

import starIcon from "../assets/markets/google/google_star.svg";
import downloadsIcon from "../assets/markets/google/google_downloads.svg";
import guardIcon from "../assets/markets/google/google_guard.svg";

import fiveStars from "../assets/markets/google/google_five_stars.svg";

import avatarIcon from "../assets/markets/default_avatar.svg";
import avatar1 from "../assets/markets/avatar_1.svg";
import avatar2 from "../assets/markets/avatar_2.svg";
import avatar3 from "../assets/markets/avatar_3.svg";

import starsIcon from "../assets/markets/apple/apple_stars.svg";
import fiveStarsApple from "../assets/markets/apple/apple_five_stars.svg";

export const appleSummary = [
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

export const googleSummary = [
  { id: 1, label: "Resenas", value: "4.8", icon: starIcon },
  { id: 2, label: "Descargas", value: "50k+", icon: null },
  { id: 3, label: "16.5 MB", value: null, icon: downloadsIcon },
  { id: 4, label: "Eleccion del editon", value: null, icon: guardIcon },
];

export const tags: string[] = ["Casino", "Slot machine", "Casual games"];

export const reviews = {
  rating: 4.8,
  reviews: "126 thousand reviews",
  percentA: 95,
  percentB: 13,
  percentC: 8,
  percentD: 5,
  percentE: 3,
};

export const googleComments: GoogleCommentData[] = [
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

export const appleComments: AppleCommentData[] = [
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
