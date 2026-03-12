import { createContext, useContext } from "react";
import { useEventTracker } from "../../hooks/useEventTracker";

type EventTrackerContextType = ReturnType<typeof useEventTracker>;

export const EventTrackerContext = createContext<EventTrackerContextType | undefined>(undefined);

export const useEventTrackerContext = () => {
  const context = useContext(EventTrackerContext);

  if (context === undefined) {
    throw new Error("useEventTrackerContext must be used within a EventTrackerContextProvider");
  }

  return context;
};
