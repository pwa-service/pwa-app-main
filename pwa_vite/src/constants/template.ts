import type { TemplateData } from "../types/template";

import productImage from "../assets/product_image.webp";

import sliderImage1 from "../assets/slider_image_1.webp";
import sliderImage2 from "../assets/slider_image_2.webp";
import sliderImage3 from "../assets/slider_image_3.webp";
import sliderImage4 from "../assets/slider_image_4.webp";
import sliderImage5 from "../assets/slider_image_5.webp";
import sliderImage6 from "../assets/slider_image_6.webp";

export const data: TemplateData = {
  productImage,
  productName: "Boca Juniors Casino",
  productCreator: "CABJ Ltd",

  images: [
    { src: sliderImage1, alt: "image 1" },
    { src: sliderImage2, alt: "image 2" },
    { src: sliderImage3, alt: "image 3" },
    { src: sliderImage4, alt: "image 4" },
    { src: sliderImage5, alt: "image 5" },
    { src: sliderImage6, alt: "image 6" },
  ],

  description: [
    "🎉💰Gana 3000$ al instante + 300 FS de bonificación 🎉💰 🏆",
    "Presentamos nuestra nueva y emocionante aplicación de juegos 🎉 Sumérgete en un mundo de diversión con bonificaciones infinitas y sorpresas diarias 🎁. ¡Nadie se va con las manos vacías! 🏅",
    "Únete a nuestra aplicación hoy mismo y prueba tu suerte en cualquier momento con asistencia las 24 horas del día, los 7 días de la semana 🕒.",
    "Ya sea de día o de noche, ¡estamos listos para ayudarte a convertirte en un ganador! 🎯🌟",
  ],
};
