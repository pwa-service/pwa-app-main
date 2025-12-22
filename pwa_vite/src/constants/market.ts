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
    text: "¡No puedo tener suficiente de la Experiencia de Casino Definitiva! ¡La selección de juegos es enorme y la calidad es inigualable! He ganado varias veces y los retiros son rápidos y sin complicaciones. ¡El servicio al cliente también es encomiable, siempre atento y servicial!",
  },
  {
    id: 2,
    type: "support",
    fullName: "BETONWIN Support",
    date: "July 3, 2025",
    text: "¡Gracias por tus amables palabras! Nos alegra saber que estás disfrutando tu tiempo con nosotros. En la Experiencia de Casino Definitiva, estamos comprometidos a ofrecer una amplia gama de juegos, seguridad de primer nivel y un servicio al cliente excepcional. Continuamente nos esforzamos por mejorar la experiencia del usuario. ¡Feliz juego! 🎰",
  },
  {
    id: 3,
    type: "user",
    fullName: "Jordan Smith",
    date: "July 4, 2025",
    text: "¡Esta app es un cambio total de juego! La interfaz es intuitiva y encontré mis juegos favoritos en segundos. La función de casino en vivo hace que la experiencia de juego sea inmersiva y social. Me siento seguro jugando aquí, gracias a las medidas de seguridad de primer nivel.",
  },
  {
    id: 4,
    type: "user",
    fullName: "Taylor Williams",
    date: "July 4, 2025",
    text: "¡Estoy absolutamente enamorado de la app Experiencia de Casino Definitiva! La variedad de juegos es asombrosa y los gráficos son increíblemente realistas. Los bonos son generosos, haciendo el juego aún más emocionante. ¡Se siente como tener un casino real en mi bolsillo!",
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
