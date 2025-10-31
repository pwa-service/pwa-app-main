import { useUserAgent } from "../hooks/useUserAgent";

import Loader from "../ui/Loader";

const HomePage = () => {
  const { isPWA } = useUserAgent();

  if (!isPWA) return null;

  return <Loader />;
};

export default HomePage;
