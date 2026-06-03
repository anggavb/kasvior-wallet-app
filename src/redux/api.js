import api from "@utils/axios";

export const getAuthToken = (getState) => getState().userLogin.user?.token;

export const makeAuthConfig = (getState, config = {}) => {
  const token = getAuthToken(getState);

  if (!token) {
    throw new Error("Missing authentication token");
  }

  const { headers, ...restConfig } = config;

  return {
    ...restConfig,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
};

const stringifyErrors = (errors) => {
  if (!errors) {
    return "";
  }

  if (Array.isArray(errors)) {
    return errors.filter(Boolean).join(", ");
  }

  if (typeof errors === "object") {
    return Object.values(errors).flat().filter(Boolean).join(", ");
  }

  return String(errors);
};

export const normalizeApiError = (error, fallback = "Request failed") => {
  const responseData = error?.response?.data || error?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  const validationMessage = stringifyErrors(responseData?.errors);
  if (validationMessage) {
    return validationMessage;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (error?.message && error.message !== "Missing authentication token") {
    return error.message;
  }

  return fallback;
};

export const getThunkErrorMessage = (error, fallback = "Request failed") => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return normalizeApiError(error, fallback);
};

export { api };
