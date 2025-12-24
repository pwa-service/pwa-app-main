import type { TemplateData } from "../types/template";

import productImage from "../assets/product_image.webp";

import sliderImage1 from "../assets/slider_image_1.webp";
import sliderImage2 from "../assets/slider_image_2.webp";
import sliderImage3 from "../assets/slider_image_3.webp";
import sliderImage4 from "../assets/slider_image_4.webp";

export const data: TemplateData = {
  productImage,
  productName: "Casino Arturo Vidal",
  productCreator: "BetOn Win®",

  images: [
    { src: sliderImage1, alt: "image 1" },
    { src: sliderImage2, alt: "image 2" },
    { src: sliderImage3, alt: "image 3" },
    { src: sliderImage4, alt: "image 4" },
  ],

  description: [
    "🎯 ¡Top Slots te regala un BONUS ÉPICO: 700% + 600 GIROS GRATIS! 💎🎰\n ¡Bienvenido a Top Slots Chile — donde la suerte, la emoción y las ganancias MEGA se unen en un solo lugar!",
    "🔥 ¡Regístrate HOY y lleva tu bono completo:\n✔ 700% de bono en tu primer depósito\n✔ 600 giros gratis en las tragamonedas más TOP\n✔ ¡Diversión sin límites desde el primer clic!",
    "🎮 Juega a los éxitos que están rompiendo récords en Chile:\n📘 Book of Dead\n 🍭 Sweet Bonanza\n ⚡ Gates of Olympus\n 🎣 Big Bass Bonanza\n ✨ Starburst",
    "🚀 Retiros ultra rápidos • Soporte 24/7 • Juega desde tu celular o computadora.📱💻\n👑 ¡Top Slots ya es el favorito de los jugadores en Chile! ¿Listo para convertirte en el próximo GANADOR?",
    "👉 ¡Haz clic YA y reclama tu BONUS ÉPICO! \n¡La suerte te está esperando… y trae 700% + 600 giros contigo!🎉",
  ],
};
