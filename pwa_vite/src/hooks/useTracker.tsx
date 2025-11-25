import type { TrackerData } from "../types/tracker";

import {
  FBCLID_KEY,
  PIXEL_ID_KEY,
  SESSION_ID_KEY,
  QUERY_TAIL_KEY,
  VIEW_CONTENT_SENT_KEY,
  FIRST_OPEN_SENT_KEY,
} from "../constants/storage";

import { useEffect, useState, useRef, useCallback } from "react";
import { useIsPWA } from "./useIsPWA";

import { postViewContent, postFirstOpen } from "../api/events";

import { parseURLParams } from "../helpers/parseURLParams";
import { saveData } from "../helpers/idbStorage";

export interface TrackerState {
  trackerData: TrackerData | null;
  redirectUrl?: string | null;

  fbclId?: string | null;
  pixelId?: string | null;
  sessionId?: string | null;

  loading: {
    viewContent: boolean;
    visitingPWA: boolean;
  };

  error: string | null;
}

const persistState = (state: TrackerState) => {
  if (state.pixelId) localStorage.setItem(PIXEL_ID_KEY, state.pixelId);
  if (state.fbclId) localStorage.setItem(FBCLID_KEY, state.fbclId);
  if (state.sessionId) localStorage.setItem(SESSION_ID_KEY, state.sessionId);
};

const restoreState = (): Partial<TrackerState> => ({
  fbclId: localStorage.getItem(FBCLID_KEY),
  pixelId: localStorage.getItem(PIXEL_ID_KEY),
  sessionId: localStorage.getItem(SESSION_ID_KEY),
});

export const useTracker = () => {
  const { isPWA } = useIsPWA();

  const [state, setState] = useState<TrackerState>({
    trackerData: null,
    ...restoreState(),

    loading: {
      viewContent: false,
      visitingPWA: false,
    },

    error: null,
  });

  const initializedRef = useRef(false);
  const initializedPWARef = useRef(false);

  const updateState = useCallback((callback: (prev: TrackerState) => TrackerState) => {
    setState((prev) => {
      const updatedState = callback(prev);
      persistState(updatedState);

      return updatedState;
    });
  }, []);

  const setLoading = useCallback(
    (key: keyof TrackerState["loading"], value: boolean) => {
      updateState((prev) => ({
        ...prev,
        loading: {
          ...prev.loading,
          [key]: value,
        },
      }));
    },
    [updateState]
  );

  const initializeTrackerData = () => {
    const currentURL = new URL(window.location.href);
    const { fbclId, pixelId } = parseURLParams(currentURL);

    const IS_DEVELOPMENT = currentURL.host === "localhost:4173";

    const trackerData = {
      pwaDomain: IS_DEVELOPMENT ? "pwaservice.site" : currentURL.host,
      landingUrl: IS_DEVELOPMENT
        ? "https://pwaservice.site/?pixel_id=317293515356&fbclid=XYZ123&utm_source=facebook&sub1=aff1&offer_id=777"
        : currentURL.href,
      queryStringRaw: IS_DEVELOPMENT
        ? "pixel_id=317293515356&fbclid=XYZ123&utm_source=facebook&sub1=aff1&offer_id=777"
        : currentURL.search.slice(1),
    };

    updateState((prev) => ({
      ...prev,
      fbclId,
      pixelId,
      trackerData,
    }));

    return trackerData;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initializedRef.current) return;

    initializedRef.current = true;

    const init = async () => {
      try {
        if (isPWA && !initializedPWARef.current) {
          initializedPWARef.current = true;

          await handlePWAFirstOpen();
        } else if (!isPWA) {
          const trackerData = initializeTrackerData();
          await handleViewContent(trackerData);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        updateState((prev) => ({ ...prev, error: errorMessage }));
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPWA]);

  const handleViewContent = async (data: TrackerData) => {
    if (localStorage.getItem(VIEW_CONTENT_SENT_KEY)) return;

    setLoading("viewContent", true);

    try {
      const { sessionId } = await postViewContent(data);
      await saveData(SESSION_ID_KEY, sessionId);

      const currentURL = new URL(window.location.href);
      const { pixelId, fbclId, remainingParams } = parseURLParams(currentURL);
      const queryTail = `?user_id=${sessionId}&pixel_id=${pixelId}&fbclid=${fbclId}&${remainingParams}`;

      await saveData(QUERY_TAIL_KEY, queryTail);
      localStorage.setItem(VIEW_CONTENT_SENT_KEY, "true");
      updateState((prev) => ({ ...prev, sessionId }));
    } catch (error) {
      localStorage.removeItem(VIEW_CONTENT_SENT_KEY);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      updateState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setLoading("viewContent", false);
    }
  };

  const handlePWAFirstOpen = async () => {
    if (localStorage.getItem(FIRST_OPEN_SENT_KEY)) return;
    if (!state.trackerData || !state.sessionId) return;

    setLoading("visitingPWA", true);

    try {
      await postFirstOpen({
        ...state.trackerData,
        sessionId: state.sessionId,
      });

      localStorage.setItem(FIRST_OPEN_SENT_KEY, "true");
    } catch (error) {
      localStorage.removeItem(FIRST_OPEN_SENT_KEY);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      updateState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setLoading("visitingPWA", false);
    }
  };

  return {
    ...state,
  };
};
