import axios from "axios";
import { getApiOrigin, getApiV1BaseUrl } from "../config/apiConfig";

let inMemoryAuthToken: string | null = null;

export function setAuthToken(token: string | null) {
  inMemoryAuthToken = token;
}

export const apiV1 = axios.create({
  baseURL: getApiV1BaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiRoot = axios.create({
  baseURL: getApiOrigin(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens (opt-in via setAuthToken)
apiV1.interceptors.request.use(
  (config) => {
    if (inMemoryAuthToken) {
      config.headers.Authorization = `Bearer ${inMemoryAuthToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
apiV1.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiV1;
