import type { TrackerState } from "../../store/useTrackingStore";

import { createContext } from "react";

export const TrackerContext = createContext<TrackerState | null>(null);
