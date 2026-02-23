import { toast } from "react-toastify";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("COPIED");
  } catch (error) {
    toast.error("FAILED COPIED");
    console.error("ERROR", error);
  }
};
