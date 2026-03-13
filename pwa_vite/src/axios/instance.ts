import axios, { type AxiosInstance } from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
const TIMEOUT_IN_SECONDS = 15 * 1000;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_IN_SECONDS,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});
