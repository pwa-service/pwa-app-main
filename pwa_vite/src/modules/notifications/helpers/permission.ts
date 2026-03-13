export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator)
  ) {
    throw new Error("Push notifications not supported");
  }

  return await Notification.requestPermission();
};
