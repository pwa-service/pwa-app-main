export const saveTokenToLocalStorage = (token: string): void => {
  localStorage.setItem("firebase_token", token);
};

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem("firebase_token");
};

export const removeTokenFromLocalStorage = (): void => {
  localStorage.removeItem("firebase_token");
};
