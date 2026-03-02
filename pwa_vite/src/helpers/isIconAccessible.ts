import { isValidImageUrl } from "./isValidImageUrl";

export const isIconAccessible = async (url: string | undefined): Promise<boolean> => {
  if (!isValidImageUrl(url)) return false;

  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
    });

    return response.ok;
  } catch (error) {
    console.warn(`Asset check failed for ${url}:`, error);
    return false;
  }
};
