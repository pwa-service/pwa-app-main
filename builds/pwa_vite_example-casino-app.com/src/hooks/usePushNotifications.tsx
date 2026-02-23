import { useState, useCallback } from "react";

import {
  requestNotificationPermission,
  saveTokenToLocalStorage,
  getTokenFromLocalStorage,
} from "../utils/notifications";
import { getFirebaseToken, removeFirebaseToken } from "../api/notifications";

interface PushNotificationState {
  loading: boolean;
  token: string | null;
  error: string | null;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    loading: false,
    token: null,
    error: null,
  });

  const setError = (message: string) => {
    setState({
      loading: false,
      token: null,
      error: message,
    });
  };

  const requestPermission = useCallback(async () => {
    try {
      setState({
        loading: true,
        token: null,
        error: null,
      });

      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        setError("Notification permission not granted");
      }

      const vapidKey = import.meta.env.VITE_APP_VAPID_PUBLIC_KEY;
      const token = await getFirebaseToken(vapidKey);

      saveTokenToLocalStorage(token);
      setState({
        loading: false,
        token,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";

      setError(message);
    }
  }, []);

  const getToken = useCallback(() => {
    const token = getTokenFromLocalStorage();

    setState((prev) => ({
      ...prev,
      token,
    }));
  }, []);

  const removeToken = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      await removeFirebaseToken();

      setState({
        loading: false,
        token: null,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setError(message);
    }
  }, []);

  const toggleSubscription = useCallback(async () => {
    try {
      const existingToken = getTokenFromLocalStorage();
      if (existingToken) {
        await removeToken();
        return;
      }

      await requestPermission();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setError(message);
    }
  }, [removeToken, requestPermission]);

  return {
    state,
    requestPermission,
    getToken,
    removeToken,
    toggleSubscription,
  };
};
