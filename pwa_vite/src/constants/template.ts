import type { TemplateData } from "../types/template";

import productImage from "../assets/product_image.webp";

import sliderImage1 from "../assets/slider_image_1.webp";
import sliderImage2 from "../assets/slider_image_2.webp";
import sliderImage3 from "../assets/slider_image_3.webp";
import sliderImage4 from "../assets/slider_image_4.webp";

export const data: TemplateData = {
  productImage,
  productName: "Agüero Casino",
  productCreator: "Beton",

  images: [
    { src: sliderImage1, alt: "image 1" },
    { src: sliderImage2, alt: "image 2" },
    { src: sliderImage3, alt: "image 3" },
    { src: sliderImage4, alt: "image 4" },
  ],

  description: [
    "¡El legendario futbolista Sergio Agüero te lo presenta!",
    "La potencia de la plataforma internacional Ace ahora se combina con la experiencia exclusiva del casino Agüero, creada con la participación directa del gran futbolista argentino. Esta plataforma única te ofrece lo mejor de los dos mundos: la elegancia incomparable de los juegos en vivo y la comodidad moderna del casino online… ¡todo en un solo lugar!",
    "Bono de bienvenida exclusivo de Agüero:",
    "100% hasta 300.000 ARS + 100 giros gratis.",
    "Oferta disponible por tiempo limitado para nuevos jugadores de Argentina.",
  ],
};
