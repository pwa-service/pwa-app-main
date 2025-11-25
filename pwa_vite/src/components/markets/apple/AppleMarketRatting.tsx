import starsIcon from "../../../assets/markets/apple/apple_stars.svg";
import avatarIcon from "../../../assets/markets/apple/default_avatar.svg";

interface IAppleMarketRattingProps {
  reviews: string;
  age: number;
  chart: number;
  creatorName: string;
}

const AppleMarketRatting = ({ reviews, age, chart, creatorName }: IAppleMarketRattingProps) => {
  return (
    <div className="flex items-center h-[75px] justify-around border-t border-b border-[#AAAAAA]">
      <div className="h-full flex items-center">
        <div className="flex flex-col items-center justify-between h-[60px] pb-[3px]">
          <p className="font-normal text-[#AAAAAA] sm:text-[10px] uppercase">Resenas</p>

          <p className="font-medium text-[#AAAAAA] sm:text-[16px]">{reviews}</p>

          <img src={starsIcon} alt="stars" />
        </div>
      </div>

      <div className="w-[1px] h-[30px] bg-[#AAAAAA]"></div>

      <div className="h-full flex items-center">
        <div className="flex flex-col items-center justify-between h-[60px]">
          <p className="font-normal text-[#AAAAAA] sm:text-[10px]">AGE</p>

          <p className="font-medium text-[#AAAAAA] sm:text-[16px] uppercase">{age} +</p>

          <p className="font-normal text-[#AAAAAA] sm:text-[10px]">Years old</p>
        </div>
      </div>

      <div className="w-[1px] h-[30px] bg-[#AAAAAA]"></div>

      <div className="h-full flex items-center">
        <div className="flex flex-col items-center justify-between h-[60px]">
          <p className="font-normal text-[#AAAAAA] sm:text-[10px]">CHART</p>

          <p className="font-medium text-[#AAAAAA] sm:text-[16px] uppercase">#{chart}</p>

          <p className="font-normal text-[#AAAAAA] sm:text-[10px]">Board</p>
        </div>
      </div>

      <div className="w-[1px] h-[30px] bg-[#AAAAAA]"></div>

      <div className="h-full flex items-center">
        <div className="flex flex-col items-center justify-between h-[60px]">
          <p className="font-normal text-[#AAAAAA] sm:text-[10px]">DEVELOPER</p>

          <img src={avatarIcon} alt="guard" className="sm:w-[19px] sm:h-[19px]" />

          <p className="font-normal text-[#AAAAAA] sm:text-[10px]">{creatorName}</p>
        </div>
      </div>
    </div>
  );
};

export default AppleMarketRatting;
