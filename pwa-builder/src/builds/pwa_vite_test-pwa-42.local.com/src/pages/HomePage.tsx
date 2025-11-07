import { useUserAgent } from "../hooks/useUserAgent";
import Loader from "../ui/Loader";

const HomePage = () => {
  const { isPWA } = useUserAgent();

  if (isPWA) return <Loader />;

  return null;
};

export default HomePage;
