export default {
  env: import.meta.env.VITE_ENV,
  appTitle: import.meta.env.VITE_APP_TITLE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
};
