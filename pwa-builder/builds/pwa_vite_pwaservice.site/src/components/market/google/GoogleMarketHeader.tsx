import { classNames } from "../../../utils/classNames";

import logo from "../../../assets/market/google-logo.svg";
import info from "../../../assets/market/google-info.svg";

const GoogleMarketHeader = () => {
  return (
    <div
      className={classNames(
        "w-full sm:h-[55px] mb-[15px]",
        "flex items-center justify-between"
      )}
    >
      <img src={logo} alt="logo" className="sm:w-[156px] sm:h-[40px]" />
      <img src={info} alt="info" className="sm:w-[22px] sm:h-[22px]" />
    </div>
  );
};

export default GoogleMarketHeader;
