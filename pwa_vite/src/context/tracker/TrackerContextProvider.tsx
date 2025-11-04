import { type ReactNode } from "react";

import { TrackerContext } from "../../context/tracker/TrackerContext";
import { useTrackerStore } from "../../store/useTrackingStore";

interface TrackingProviderProps {
  children: ReactNode;
}

const TrackerProvider = ({ children }: TrackingProviderProps) => {
  const trackerData = useTrackerStore();

  return <TrackerContext.Provider value={trackerData}>{children}</TrackerContext.Provider>;
};

export default TrackerProvider;
