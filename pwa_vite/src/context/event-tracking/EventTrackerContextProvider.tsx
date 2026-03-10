import { type ReactNode } from "react";

import { EventTrackerContext } from "./EventTrackerContext";
import { useEventTracker } from "../../hooks/useEventTracker";

interface EventTrackerProviderProps {
  children: ReactNode;
}

const EventTrackerContextProvider = ({ children }: EventTrackerProviderProps) => {
  const eventTrackerData = useEventTracker();

  return (
    <EventTrackerContext.Provider value={eventTrackerData}>{children}</EventTrackerContext.Provider>
  );
};

export default EventTrackerContextProvider;
