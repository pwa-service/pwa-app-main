import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";

interface CardProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

const Card = ({ onClick, className, children }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames("w-full p-2 rounded-lg", className)}
    >
      {children}
    </div>
  );
};

export default Card;
