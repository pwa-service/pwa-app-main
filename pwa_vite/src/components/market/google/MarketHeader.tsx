import { classNames } from "../../../utils/classNames";

import logo from "../../../assets/market/google-logo.svg";
import info from "../../../assets/market/google-info.svg";

const MarketHeader = () => {
  return (
    <div
      className={classNames(
        "w-full sm:h-[55px] mt-4 mb-8",
        "flex items-center justify-between"
      )}
    >
      <img src={logo} alt="logo" className="sm:w-[156px] sm:h-[40px]" />
      <img src={info} alt="info" className="sm:w-[22px] sm:h-[22px]" />
    </div>
  );
};

export default MarketHeader;
