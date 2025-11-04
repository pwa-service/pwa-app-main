import Button from "../MarketButton";

interface IAppleProductSectionProps {
  image: string;
  name: string;
  creator: string;
}

const AppleProductSection = ({
  image,
  name,
  creator,
}: IAppleProductSectionProps) => {
  return (
    <div className="flex mb-[20px] mt-[20px]">
      <div
        className="sm:w-[100px] sm:h-[100px] bg-cover"
        style={{
          backgroundImage: `url("${image}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="ml-[12px]">
        <h2 className="font-semibold sm:text-[18px] flex items-center gap-[4px] text-[#0D0D0D]">
          {name}
        </h2>

        <h3 className="font-medium sm:text-[14px] text-[#797979] uppercase mb-[9px]">
          {creator}
        </h3>

        <Button
          text="Instalar"
          variant="apple"
          onClick={() => console.log("test")}
        />
      </div>
    </div>
  );
};

export default AppleProductSection;
