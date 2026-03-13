import { type ImgHTMLAttributes, useState, useEffect } from "react";

import { isValidImageUrl } from "../../../helpers/isValidImageUrl";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string | undefined;
  fallback?: string;
}

const SmartImage = ({
  src,
  fallback = "/placeholder.webp",
  alt = "image",
  className,
  ...props
}: SmartImageProps) => {
  const initialSrc = isValidImageUrl(src) ? src : fallback;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  useEffect(() => {
    setImgSrc(isValidImageUrl(src) ? src : fallback);
  }, [src, fallback]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
};

export default SmartImage;
