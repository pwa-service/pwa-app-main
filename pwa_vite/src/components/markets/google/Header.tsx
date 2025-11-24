import { classNames } from "../../../utils/classNames";

import logo from "../../../assets/markets/google/google_logo.svg";
import info from "../../../assets/markets/google/google_info.svg";

const Header = () => {
  return (
    <div
      className={classNames("w-full sm:h-[55px] mt-4 mb-8", "flex items-center justify-between")}
    >
      <img src={logo} alt="logo" className="sm:w-[156px] sm:h-10" />
      <img src={info} alt="info" className="sm:w-[22px] sm:h-[22px]" />
    </div>
  );
};

export default Header;
