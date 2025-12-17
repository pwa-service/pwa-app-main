import { classNames } from "../../../utils/classNames";

import { FaStar } from "react-icons/fa";

interface StarsProps {
  className?: string;
  size: number;
}

const Stars = ({ className, size }: StarsProps) => {
  return (
    <div className={classNames("flex items-center", className)}>
      {Array.from({ length: 5 }).map(() => (
        <FaStar size={size} />
      ))}
    </div>
  );
};

export default Stars;
