import type { UseTrackerStoreReturn } from "../../store/useTrackingStore";

import { createContext } from "react";

export const TrackerContext = createContext<UseTrackerStoreReturn | null>(null);
