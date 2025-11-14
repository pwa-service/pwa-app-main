import {
  FBCLID_KEY,
  PIXEL_ID_KEY,
  VIEW_CONTENT_KEY,
  SESSION_ID_KEY,
  FIRST_OPEN_SENT_KEY,
  REDIRECT_URL_KEY,
} from "../constants/storage";

import type { TrackerData } from "../types/tracker";

import { useEffect, useState, useRef, useCallback } from "react";
import { useUserAgent } from "../hooks/useUserAgent";

import { loadPWAData } from "../helpers/loadPWAData";
import { parseURLParams } from "../helpers/parseURLParams";
import { sendRedirectToSW } from "../helpers/sendRedirectToSW";

import { postViewContent, postFirstOpen } from "../api/events";

export interface TrackerState {
  trackerData: TrackerData | null;
  redirectUrl?: string | null;

  fbclId?: string | null;
  pixelId?: string | null;
  sessionId?: string | null;

  loading: {
    tracker: boolean;
    install: boolean;
  };

  error: string | null;
}

export interface UseTrackerStoreReturn extends TrackerState {
  handlePreparePWALink: () => void;
}

const persistState = (state: TrackerState) => {
  if (state.pixelId) localStorage.setItem(PIXEL_ID_KEY, state.pixelId);
  if (state.fbclId) localStorage.setItem(FBCLID_KEY, state.fbclId);
  if (state.sessionId) localStorage.setItem(SESSION_ID_KEY, state.sessionId);
  if (state.redirectUrl) localStorage.setItem(REDIRECT_URL_KEY, state.redirectUrl);
};

const restoreState = (): Partial<TrackerState> => ({
  fbclId: localStorage.getItem(FBCLID_KEY),
  pixelId: localStorage.getItem(PIXEL_ID_KEY),
  sessionId: localStorage.getItem(SESSION_ID_KEY),
  redirectUrl: localStorage.getItem(REDIRECT_URL_KEY),
});

export const useTrackerStore = (): UseTrackerStoreReturn => {
  const { isPWA } = useUserAgent();

  const [state, setState] = useState<TrackerState>({
    trackerData: null,
    ...restoreState(),
    loading: {
      tracker: false,
      install: false,
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

    const trackerData = {
      pwaDomain: currentURL.host,
      landingUrl: currentURL.href,
      queryStringRaw: currentURL.search.slice(1),
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
    setLoading("tracker", true);

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
      } finally {
        setLoading("tracker", false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPWA]);

  const handleViewContent = async (data: TrackerData) => {
    if (localStorage.getItem(VIEW_CONTENT_KEY)) return;

    setLoading("tracker", true);

    try {
      const { sessionId } = await postViewContent(data);

      localStorage.setItem(VIEW_CONTENT_KEY, "true");
      updateState((prev) => ({ ...prev, sessionId }));
    } catch (error) {
      localStorage.removeItem(VIEW_CONTENT_KEY);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      updateState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setLoading("tracker", false);
    }
  };

  const handlePreparePWALink = () => {
    if (!state.sessionId) return;

    const { fbclId, pixelId, sessionId } = state;

    const currentURL = new URL(window.location.href);
    const { remainingParams } = parseURLParams(currentURL);

    const baseUrl = loadPWAData().destination_url;
    const redirectUrl = `${baseUrl}?user_id=${sessionId}&pixel_id=${pixelId}&fbclid=${fbclId}&${remainingParams}`;

    console.log("[Main] Prepared redirect URL:", redirectUrl);

    sendRedirectToSW(redirectUrl);
    updateState((prev) => ({ ...prev, redirectUrl }));
  };

  const handlePWAFirstOpen = async () => {
    if (localStorage.getItem(FIRST_OPEN_SENT_KEY)) return;
    if (!state.trackerData || !state.sessionId) return;

    setLoading("tracker", true);

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
      setLoading("tracker", false);
    }
  };

  return {
    ...state,
    handlePreparePWALink,
  };
};
