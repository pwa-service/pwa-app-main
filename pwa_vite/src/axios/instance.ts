import axios, { type AxiosInstance } from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || "http://72.60.247.106:3000";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  timeout: 10000,
});
