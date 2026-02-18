import type { TemplateData } from "../types/template";

import productImage from "../assets/product_image.webp";

import sliderImage1 from "../assets/slider_image_1.webp";
import sliderImage2 from "../assets/slider_image_2.webp";
import sliderImage3 from "../assets/slider_image_3.webp";
import sliderImage4 from "../assets/slider_image_4.webp";
import sliderImage5 from "../assets/slider_image_5.webp";

export const data: TemplateData = {
  productImage,
  productName: "Agüero Casino",
  productCreator: "BetOn Win®",

  images: [
    { src: sliderImage1, alt: "image 1" },
    { src: sliderImage2, alt: "image 2" },
    { src: sliderImage3, alt: "image 3" },
    { src: sliderImage4, alt: "image 4" },
    { src: sliderImage5, alt: "image 5" },
  ],

  description: [
    "¡Agüero Casino, la app oficial para los que aman jugar en Argentina! :flag-ar:¡Acá te regalamos un BONO de $3.000.000 + 600 Giros Gratis para que empieces a jugar a lo grande!",
    "Lo mejor: tus premios llegan rapidísimo. Es fácil, rápido y miles de argentinos ya están jugando y ganando todos los días.",
    "Solo tenés que descargar la app, registrarte, hacer tu primer depósito ¡y arrancar la diversión! La suerte puede estar de tu lado en el próximo giro… ¿listo para ganar en grande?",
  ],
};
