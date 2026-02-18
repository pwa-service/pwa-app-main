import { classNames } from "../../utils/classNames";

import { LuBellOff, LuBellRing } from "react-icons/lu";

import LoadingSpinner from "../../ui/LoadingSpinner";

interface SubscribeButtonProps {
  loading: boolean;
  token: string | null;
  toggleSubscription: () => void;
}

const SubscribeButton = ({ loading, token, toggleSubscription }: SubscribeButtonProps) => {
  const subscription = !!token && token.length > 0;

  return (
    <button
      onClick={toggleSubscription}
      disabled={loading}
      className={classNames(
        "w-10 h-10",
        "flex items-center justify-center",
        "rounded-lg border-2 border-gray-500",
        loading ? "" : "cursor-pointer",
        subscription ? "border-green-400 bg-green-200" : "bg-gray-200"
      )}
    >
      {loading ? (
        <LoadingSpinner />
      ) : subscription ? (
        <LuBellRing size={20} />
      ) : (
        <LuBellOff size={20} />
      )}
    </button>
  );
};

export default SubscribeButton;
