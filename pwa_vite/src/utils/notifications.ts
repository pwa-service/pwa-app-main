export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      throw new Error("Push notifications not supported");
    }

    return await Notification.requestPermission();
  };

export const saveTokenToLocalStorage = (token: string): void => {
  localStorage.setItem("firebase_token", token);
};

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem("firebase_token");
};

export const removeTokenFromLocalStorage = (): void => {
  localStorage.removeItem("firebase_token");
};
