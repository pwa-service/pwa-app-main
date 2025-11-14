import { classNames } from "../../utils/classNames";

interface IProductImageProps {
  image: string;
  className?: string;
}

const ProductImage = ({ image, className }: IProductImageProps) => {
  return (
    <div className={classNames("relative", className)}>
      <img src={image} alt="" className="w-full h-full" />
    </div>
  );
};

export default ProductImage;
