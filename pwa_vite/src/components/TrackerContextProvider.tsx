import { type ReactNode } from "react";

import { TrackerContext } from "../context/TrackerContext";
import { useTracker } from "../hooks/useTracker";

interface TrackingProviderProps {
  children: ReactNode;
}

const TrackerContextProvider = ({ children }: TrackingProviderProps) => {
  const trackerData = useTracker();

  return <TrackerContext.Provider value={trackerData}>{children}</TrackerContext.Provider>;
};

export default TrackerContextProvider;
