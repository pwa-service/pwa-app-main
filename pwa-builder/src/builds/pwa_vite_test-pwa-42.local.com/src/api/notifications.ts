import { getToken, deleteToken } from "firebase/messaging";
import { messaging } from "../firebase/config";
import { removeTokenFromLocalStorage } from "../utils/notifications";

export const getFirebaseToken = async (vapidKey: string): Promise<string> => {
  const token = await getToken(messaging, { vapidKey });

  if (!token) {
    throw new Error("Failed to retrieve Firebase token");
  }

  return token;
};

export const removeFirebaseToken = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("firebase_token");

    if (!token) {
      throw new Error("No Firebase token found in localStorage");
    }

    const deleted = await deleteToken(messaging);

    if (deleted) {
      removeTokenFromLocalStorage();
    } else {
      throw new Error("Failed to delete Firebase token");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error deleting token: ${error.message}`);
    } else {
      throw new Error("Unknown error deleting token");
    }
  }
};
