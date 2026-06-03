import axios from "axios";

import getEnv from "./getEnv";

const api = axios.create({
  baseURL: getEnv.apiBaseUrl,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.data) {
      error.data = error.response.data;
    }

    return Promise.reject(error);
  },
);

export default api;
