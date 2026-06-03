import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api, makeAuthConfig, normalizeApiError } from "../api";
import { getApiAssetUrl } from "@utils/transactionHistory";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

export const normalizeAuthUser = (user = {}) => ({
  id: user.id,
  email: user.email,
  name: user.fullname ?? user.name ?? "",
  phone: user.phone_number ?? user.phone ?? "",
  avatar: getApiAssetUrl(user.photo ?? user.avatar ?? ""),
  isVerified: Boolean(user.is_verified ?? user.isVerified),
  hasPin: Boolean(user.has_pin ?? user.hasPin),
  token: user.token,
  balance: user.balance,
});

const normalizeUserPatch = (user = {}) => {
  const patch = {};

  if ("id" in user) {
    patch.id = user.id;
  }

  if ("email" in user) {
    patch.email = user.email;
  }

  if ("fullname" in user || "name" in user) {
    patch.name = user.fullname ?? user.name ?? "";
  }

  if ("phone_number" in user || "phone" in user) {
    patch.phone = user.phone_number ?? user.phone ?? "";
  }

  if ("photo" in user || "avatar" in user) {
    patch.avatar = getApiAssetUrl(user.photo ?? user.avatar ?? "");
  }

  if ("is_verified" in user || "isVerified" in user) {
    patch.isVerified = Boolean(user.is_verified ?? user.isVerified);
  }

  if ("has_pin" in user || "hasPin" in user) {
    patch.hasPin = Boolean(user.has_pin ?? user.hasPin);
  }

  if ("balance" in user) {
    patch.balance = user.balance;
  }

  return patch;
};

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password: _password, pin: _pin, ...safeUser } = user;
  return safeUser;
};

const rejectWithMessage = (rejectWithValue, error, fallback) =>
  rejectWithValue(normalizeApiError(error, fallback));

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth", { email, password });
      return normalizeAuthUser(response.data);
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Invalid email or password",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await api.post("/auth/register", { email, password });
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Registration failed. Please try again.",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      return await api.post("/auth/forgot-password", { email });
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Failed to send reset instructions",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ newPassword, resetToken }, { rejectWithValue }) => {
    try {
      return await api.post(
        "/auth/reset-password",
        { new_password: newPassword },
        {
          headers: {
            "X-Reset-Token": resetToken,
          },
        },
      );
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Failed to reset password",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState }) => {
    if (getState().userLogin.user?.token) {
      try {
        await api.delete("/auth/logout", makeAuthConfig(getState));
      } catch {
        // Backend logout failure should not keep the user trapped locally.
      }
    }

    return null;
  },
);

const setLoading = (state) => {
  state.status = "loading";
  state.error = null;
};

const setRejected = (state, { payload, error }) => {
  state.status = "failed";
  state.error = payload || error.message;
};

const userLoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.user = sanitizeUser(payload);
    },
    updated: (state, { payload }) => {
      state.user = sanitizeUser({ ...state.user, ...payload });
    },
    logout: (state) => {
      state.user = initialState.user;
      state.status = "idle";
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, setLoading)
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.error = null;
        state.user = sanitizeUser(payload);
      })
      .addCase(loginUser.rejected, setRejected)
      .addCase(registerUser.pending, setLoading)
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, setRejected)
      .addCase(forgotPassword.pending, setLoading)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(forgotPassword.rejected, setRejected)
      .addCase(resetPassword.pending, setLoading)
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(resetPassword.rejected, setRejected)
      .addCase(logoutUser.pending, setLoading)
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase("account/fetchProfile/fulfilled", (state, { payload }) => {
        state.user = sanitizeUser({
          ...state.user,
          ...normalizeUserPatch(payload),
        });
      })
      .addCase("account/updateProfile/fulfilled", (state, { payload }) => {
        state.user = sanitizeUser({
          ...state.user,
          ...normalizeUserPatch(payload),
        });
      })
      .addCase("account/updatePin/fulfilled", (state) => {
        state.user = sanitizeUser({
          ...state.user,
          hasPin: true,
        });
      })
      .addCase("account/fetchWallet/fulfilled", (state, { payload }) => {
        state.user = sanitizeUser({
          ...state.user,
          balance: payload?.balance,
        });
      })
      .addCase("transaction/createTopup/fulfilled", (state, { payload }) => {
        if (!state.user || payload?.amount == null) {
          return;
        }

        state.user.balance =
          Number(state.user.balance || 0) + Number(payload.amount || 0);
      })
      .addCase(
        "transaction/confirmTransferPin/fulfilled",
        (state, { payload }) => {
          if (!state.user || payload?.amount == null) {
            return;
          }

          state.user.balance =
            Number(state.user.balance || 0) - Number(payload.amount || 0);
        },
      );
  },
});

export default userLoginSlice.reducer;
