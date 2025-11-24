import type { EventBaseBodyData, PostFirstOpenBodyData } from "../types/events";

import { axiosInstance } from "../axios/instance";

export const postViewContent = async (
  bodyData: EventBaseBodyData
): Promise<{ sessionId: string }> => {
  try {
    const { data } = await axiosInstance.post("/api/event/view-content", bodyData);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postFirstOpen = async (bodyData: PostFirstOpenBodyData): Promise<unknown> => {
  try {
    const { data } = await axiosInstance.post("/api/event/first-open", bodyData);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
