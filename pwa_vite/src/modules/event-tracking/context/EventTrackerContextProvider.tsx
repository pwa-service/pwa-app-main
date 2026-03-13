import { type ReactNode } from "react";
import { useEventTracker } from "../hooks";
import { EventTrackerContext } from "./EventTrackerContext";

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
