import type { AppleCommentData, GoogleCommentData, ReviewsData } from "../types/market";

export const tags: string[] = ["Gambling", "Casino", "Slot machine", "Casual games"];

export const reviews: ReviewsData = {
  rating: 4.8,
  reviews: "499 reviews",
  percentA: 81,
  percentB: 14,
  percentC: 4,
  percentD: 1,
  percentE: 0,
};

export const googleComments: GoogleCommentData[] = [
  {
    id: 1,
    type: "user",
    fullName: "Alex Morgan",
    date: "July 3, 2025",
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
    text: "This app is a game-changer! The user interface is intuitive, and I found my favorite games in seconds. The live casino feature makes the gaming experience immersive and social. I feel safe playing here, thanks to the top-notch security measures in place.",
  },
  {
    id: 4,
    type: "user",
    fullName: "Taylor Williams",
    date: "July 4, 2025",
    text: "I'm absolutely in love with the Ultimate Casino Experience app! The variety of games is astounding, and the graphics are incredibly realistic. The bonuses are generous, making the gameplay even more exciting. It feels like I have a real casino right in my pocket!",
  },
];

export const appleComments: AppleCommentData[] = [
  {
    id: 1,
    fullName: "Alex Morgan",
    date: "03.07.25",
    text: "I can't get enough of the Ultimate Casino Experience! The game selection is vast, and the quality is unmatched. I’ve won several times, and withdrawals are swift and hassle-free. The customer service is also commendable - responsive and helpful!",
  },
  {
    id: 2,
    fullName: "Alex Morgan",
    date: "03.07.25",
    text: "I can't get enough of the Ultimate Casino Experience! The game selection is vast, and the quality is unmatched. I’ve won several times, and withdrawals are swift and hassle-free. The customer service is also commendable - responsive and helpful!",
  },
  {
    id: 3,
    fullName: "Alex Morgan",
    date: "03.07.25",
    text: "I can't get enough of the Ultimate Casino Experience! The game selection is vast, and the quality is unmatched. I’ve won several times, and withdrawals are swift and hassle-free. The customer service is also commendable - responsive and helpful!",
  },
];
