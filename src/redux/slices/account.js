import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api, makeAuthConfig, normalizeApiError } from "../api";

const initialAsyncState = {
  status: "idle",
  error: null,
};

const initialState = {
  profile: {
    data: null,
    ...initialAsyncState,
  },
  profileUpdate: {
    ...initialAsyncState,
  },
  password: {
    ...initialAsyncState,
  },
  pin: {
    ...initialAsyncState,
  },
  wallet: {
    data: null,
    ...initialAsyncState,
  },
  report: {
    data: [],
    requestKey: "",
    ...initialAsyncState,
  },
};

const rejectWithMessage = (rejectWithValue, error, fallback) =>
  rejectWithValue(normalizeApiError(error, fallback));

export const fetchProfile = createAsyncThunk(
  "account/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.get("/users/me/", makeAuthConfig(getState));
      return response.data;
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Failed to load profile.",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "account/updateProfile",
  async ({ name, phone, photo } = {}, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (name != null) {
        formData.append("fullname", name);
      }

      if (phone != null) {
        formData.append("phone_number", phone);
      }

      if (photo) {
        formData.append("photo", photo);
      }

      const response = await api.patch(
        "/users/me/",
        formData,
        makeAuthConfig(getState),
      );

      return response.data;
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Failed to update profile.",
      );
    }
  },
);

export const updatePassword = createAsyncThunk(
  "account/updatePassword",
  async (
    { currentPassword, newPassword },
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.patch(
        "/users/me/password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        makeAuthConfig(getState),
      );

      return response;
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Failed to update password.",
      );
    }
  },
);

export const updatePin = createAsyncThunk(
  "account/updatePin",
  async ({ pin }, { getState, rejectWithValue }) => {
    try {
      const response = await api.patch(
        "/users/me/pin",
        { pin },
        makeAuthConfig(getState),
      );

      return response;
    } catch (error) {
      return rejectWithMessage(rejectWithValue, error, "Failed to update pin.");
    }
  },
);

export const fetchWallet = createAsyncThunk(
  "account/fetchWallet",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.get("/users/me/wallet", makeAuthConfig(getState));
      return response.data;
    } catch (error) {
      return rejectWithMessage(
        rejectWithValue,
        error,
        "Failed to load wallet.",
      );
    }
  },
);

export const fetchTransactionReport = createAsyncThunk(
  "account/fetchTransactionReport",
  async (
    { duration = "7d", type = "all", requestKey = `${duration}:${type}` } = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        "/users/me/transaction-report",
        makeAuthConfig(getState, {
          params: {
            duration,
            type,
          },
        }),
      );

      return {
        data: response.data ?? [],
        requestKey,
      };
    } catch (error) {
      return rejectWithValue({
        message: normalizeApiError(
          error,
          "Failed to load transaction report.",
        ),
        requestKey,
      });
    }
  },
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profile.status = "loading";
        state.profile.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.profile.status = "succeeded";
        state.profile.data = payload;
      })
      .addCase(fetchProfile.rejected, (state, { payload, error }) => {
        state.profile.status = "failed";
        state.profile.error = payload || error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.profileUpdate.status = "loading";
        state.profileUpdate.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.profileUpdate.status = "succeeded";
        state.profile.data = payload;
      })
      .addCase(updateProfile.rejected, (state, { payload, error }) => {
        state.profileUpdate.status = "failed";
        state.profileUpdate.error = payload || error.message;
      })
      .addCase(updatePassword.pending, (state) => {
        state.password.status = "loading";
        state.password.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.password.status = "succeeded";
      })
      .addCase(updatePassword.rejected, (state, { payload, error }) => {
        state.password.status = "failed";
        state.password.error = payload || error.message;
      })
      .addCase(updatePin.pending, (state) => {
        state.pin.status = "loading";
        state.pin.error = null;
      })
      .addCase(updatePin.fulfilled, (state) => {
        state.pin.status = "succeeded";
      })
      .addCase(updatePin.rejected, (state, { payload, error }) => {
        state.pin.status = "failed";
        state.pin.error = payload || error.message;
      })
      .addCase(fetchWallet.pending, (state) => {
        state.wallet.status = "loading";
        state.wallet.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, { payload }) => {
        state.wallet.status = "succeeded";
        state.wallet.data = payload;
      })
      .addCase(fetchWallet.rejected, (state, { payload, error }) => {
        state.wallet.status = "failed";
        state.wallet.error = payload || error.message;
      })
      .addCase(fetchTransactionReport.pending, (state, { meta }) => {
        const arg = meta.arg || {};
        state.report.requestKey =
          arg.requestKey || `${arg.duration || "7d"}:${arg.type || "all"}`;
        state.report.status = "loading";
        state.report.error = null;
      })
      .addCase(fetchTransactionReport.fulfilled, (state, { payload }) => {
        if (state.report.requestKey !== payload.requestKey) {
          return;
        }

        state.report.status = "succeeded";
        state.report.data = payload.data;
      })
      .addCase(fetchTransactionReport.rejected, (state, { payload, error }) => {
        if (payload?.requestKey && state.report.requestKey !== payload.requestKey) {
          return;
        }

        state.report.status = "failed";
        state.report.error = payload?.message || error.message;
      })
      .addCase("transaction/createTopup/fulfilled", (state, { payload }) => {
        if (!state.wallet.data || payload?.amount == null) {
          return;
        }

        state.wallet.data.balance =
          Number(state.wallet.data.balance || 0) + Number(payload.amount || 0);
        state.wallet.data.income =
          Number(state.wallet.data.income || 0) + Number(payload.amount || 0);
      })
      .addCase(
        "transaction/confirmTransferPin/fulfilled",
        (state, { payload }) => {
          if (!state.wallet.data || payload?.amount == null) {
            return;
          }

          state.wallet.data.balance =
            Number(state.wallet.data.balance || 0) -
            Number(payload.amount || 0);
          state.wallet.data.expense =
            Number(state.wallet.data.expense || 0) +
            Number(payload.amount || 0);
        },
      );
  },
});

export default accountSlice.reducer;
