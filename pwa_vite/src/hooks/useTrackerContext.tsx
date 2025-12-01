import { useContext } from "react";
import { TrackerContext } from "../context/TrackerContext";

export const useTrackerContext = () => {
  const context = useContext(TrackerContext);

  if (!context) {
    throw new Error("useTracking must be used within a TrackingProvider");
  }

  return context;
};
