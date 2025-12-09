import type { TrackerState } from "../hooks/useTracker";

import { createContext } from "react";

export const TrackerContext = createContext<TrackerState | null>(null);
