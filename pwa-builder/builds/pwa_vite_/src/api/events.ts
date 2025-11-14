import type {
  EventBaseBodyData,
  PostInstallLinkBodyData,
  PostFirstOpenBodyData,
  PostLeadBodyData,
  PostCompleteRegistartionBodyData,
  PostPurchaseBodyData,
  PostSubscribeBodyData,
  PostViewContentResponseData,
  PostInstallLinkResponseData,
} from "../types/events";

import { axiosInstance } from "../axios/instance";

export const postViewContent = async (
  bodyData: EventBaseBodyData
): Promise<PostViewContentResponseData> => {
  try {
    const { data } = await axiosInstance.post("/api/event/view-content", bodyData);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postPrepareInstallLink = async (
  bodyData: PostInstallLinkBodyData
): Promise<PostInstallLinkResponseData> => {
  try {
    const { data } = await axiosInstance.post("/api/event/prepare-install-link", bodyData);

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

export const postLead = async (bodyData: PostLeadBodyData): Promise<unknown> => {
  try {
    const { data } = await axiosInstance.post("/api/event/lead", bodyData);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postCompleteRegistration = async (
  bodyData: PostCompleteRegistartionBodyData
): Promise<unknown> => {
  try {
    const { data } = await axiosInstance.post("/api/event/complete-registration", bodyData);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postPurchase = async (bodyData: PostPurchaseBodyData): Promise<unknown> => {
  try {
    const { data } = await axiosInstance.post("/api/event/purchase", bodyData);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postSubscribe = async (bodyData: PostSubscribeBodyData): Promise<unknown> => {
  try {
    const { data } = await axiosInstance.post("/api/event/subscribe", bodyData);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
