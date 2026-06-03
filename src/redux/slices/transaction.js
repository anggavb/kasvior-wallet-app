import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api, makeAuthConfig, normalizeApiError } from "../api";

const emptyHistory = {
  items: [],
  meta: {
    page: 1,
    limit: 5,
    total: 0,
    total_pages: 0,
  },
};

const initialState = {
  paymentMethods: {
    items: [],
    requestKey: "",
    status: "idle",
    error: null,
  },
  history: {
    data: emptyHistory,
    requestKey: "",
    status: "idle",
    error: null,
  },
  dashboardHistory: {
    items: [],
    requestKey: "",
    status: "idle",
    error: null,
  },
  receivers: {
    items: [],
    meta: null,
    requestKey: "",
    status: "idle",
    error: null,
  },
  topup: {
    status: "idle",
    error: null,
  },
  transferCreate: {
    status: "idle",
    error: null,
  },
  pinConfirm: {
    status: "idle",
    error: null,
  },
};

const requestErrorPayload = (error, fallback, requestKey) => ({
  message: normalizeApiError(error, fallback),
  requestKey,
});

export const fetchPaymentMethods = createAsyncThunk(
  "transaction/fetchPaymentMethods",
  async (
    { requestKey = "payment-methods" } = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        "/transaction/payment-methods",
        makeAuthConfig(getState),
      );

      return {
        items: response.data?.items ?? [],
        requestKey,
      };
    } catch (error) {
      return rejectWithValue(
        requestErrorPayload(
          error,
          "Failed to load payment methods.",
          requestKey,
        ),
      );
    }
  },
);

export const createTopup = createAsyncThunk(
  "transaction/createTopup",
  async (
    { paymentMethodId, amount, discount, tax, subTotal },
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        "/transaction/topup",
        {
          type: "topup",
          payment_method_id: paymentMethodId,
          amount,
          discount,
          tax,
          sub_total: subTotal,
        },
        makeAuthConfig(getState),
      );

      return {
        response,
        amount,
      };
    } catch (error) {
      return rejectWithValue(normalizeApiError(error, "Top up failed."));
    }
  },
);

export const fetchHistory = createAsyncThunk(
  "transaction/fetchHistory",
  async (
    { q = "", page = 1, limit = 5, requestKey = `${q}:${page}:${limit}` } = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        "/transaction/history",
        makeAuthConfig(getState, {
          params: {
            q,
            page,
            limit,
          },
        }),
      );

      return {
        data: response.data ?? {
          ...emptyHistory,
          meta: { ...emptyHistory.meta, page, limit },
        },
        requestKey,
      };
    } catch (error) {
      return rejectWithValue(
        requestErrorPayload(
          error,
          "Failed to load transaction history.",
          requestKey,
        ),
      );
    }
  },
);

export const fetchDashboardHistory = createAsyncThunk(
  "transaction/fetchDashboardHistory",
  async (
    { page = 1, limit = 10, requestKey = `${page}:${limit}` } = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        "/transaction/history",
        makeAuthConfig(getState, {
          params: {
            page,
            limit,
          },
        }),
      );

      return {
        items: response.data?.items ?? [],
        requestKey,
      };
    } catch (error) {
      return rejectWithValue(
        requestErrorPayload(error, "Failed to load history.", requestKey),
      );
    }
  },
);

export const fetchReceivers = createAsyncThunk(
  "transaction/fetchReceivers",
  async (
    { search = "", page = 1, limit = 20, requestKey = `${search}:${page}:${limit}` } = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        "/transaction/transfer/receivers",
        makeAuthConfig(getState, {
          params: {
            search,
            page,
            limit,
          },
        }),
      );

      return {
        items: response.data?.items ?? [],
        meta: response.data?.meta ?? null,
        requestKey,
      };
    } catch (error) {
      return rejectWithValue(
        requestErrorPayload(error, "Failed to load receivers.", requestKey),
      );
    }
  },
);

export const createTransfer = createAsyncThunk(
  "transaction/createTransfer",
  async (
    { recipientWalletId, amount, notes },
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        "/transaction/transfer",
        {
          recipient_wallet_id: recipientWalletId,
          amount,
          notes,
        },
        makeAuthConfig(getState),
      );

      return {
        ...response.data,
        amount,
        notes,
      };
    } catch (error) {
      return rejectWithValue(
        normalizeApiError(error, "Transfer failed to start."),
      );
    }
  },
);

export const confirmTransferPin = createAsyncThunk(
  "transaction/confirmTransferPin",
  async (
    { pin, transactionId, amount },
    { getState, rejectWithValue },
  ) => {
    try {
      await api.post(
        "/users/me/pin/check",
        {
          pin,
          transaction_id: transactionId,
        },
        makeAuthConfig(getState),
      );

      return {
        amount,
        transactionId,
      };
    } catch (error) {
      return rejectWithValue(normalizeApiError(error, "PIN confirmation failed."));
    }
  },
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentMethods.pending, (state, { meta }) => {
        state.paymentMethods.requestKey =
          meta.arg?.requestKey || "payment-methods";
        state.paymentMethods.status = "loading";
        state.paymentMethods.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, { payload }) => {
        if (state.paymentMethods.requestKey !== payload.requestKey) {
          return;
        }

        state.paymentMethods.status = "succeeded";
        state.paymentMethods.items = payload.items;
      })
      .addCase(fetchPaymentMethods.rejected, (state, { payload, error }) => {
        if (
          payload?.requestKey &&
          state.paymentMethods.requestKey !== payload.requestKey
        ) {
          return;
        }

        state.paymentMethods.status = "failed";
        state.paymentMethods.items = [];
        state.paymentMethods.error = payload?.message || error.message;
      })
      .addCase(createTopup.pending, (state) => {
        state.topup.status = "loading";
        state.topup.error = null;
      })
      .addCase(createTopup.fulfilled, (state) => {
        state.topup.status = "succeeded";
      })
      .addCase(createTopup.rejected, (state, { payload, error }) => {
        state.topup.status = "failed";
        state.topup.error = payload || error.message;
      })
      .addCase(fetchHistory.pending, (state, { meta }) => {
        const arg = meta.arg || {};
        state.history.requestKey =
          arg.requestKey || `${arg.q || ""}:${arg.page || 1}:${arg.limit || 5}`;
        state.history.status = "loading";
        state.history.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, { payload }) => {
        if (state.history.requestKey !== payload.requestKey) {
          return;
        }

        state.history.status = "succeeded";
        state.history.data = payload.data;
      })
      .addCase(fetchHistory.rejected, (state, { payload, error }) => {
        if (payload?.requestKey && state.history.requestKey !== payload.requestKey) {
          return;
        }

        state.history.status = "failed";
        state.history.data = emptyHistory;
        state.history.error = payload?.message || error.message;
      })
      .addCase(fetchDashboardHistory.pending, (state, { meta }) => {
        const arg = meta.arg || {};
        state.dashboardHistory.requestKey =
          arg.requestKey || `${arg.page || 1}:${arg.limit || 10}`;
        state.dashboardHistory.status = "loading";
        state.dashboardHistory.error = null;
      })
      .addCase(fetchDashboardHistory.fulfilled, (state, { payload }) => {
        if (state.dashboardHistory.requestKey !== payload.requestKey) {
          return;
        }

        state.dashboardHistory.status = "succeeded";
        state.dashboardHistory.items = payload.items;
      })
      .addCase(fetchDashboardHistory.rejected, (state, { payload, error }) => {
        if (
          payload?.requestKey &&
          state.dashboardHistory.requestKey !== payload.requestKey
        ) {
          return;
        }

        state.dashboardHistory.status = "failed";
        state.dashboardHistory.items = [];
        state.dashboardHistory.error = payload?.message || error.message;
      })
      .addCase(fetchReceivers.pending, (state, { meta }) => {
        const arg = meta.arg || {};
        state.receivers.requestKey =
          arg.requestKey ||
          `${arg.search || ""}:${arg.page || 1}:${arg.limit || 20}`;
        state.receivers.status = "loading";
        state.receivers.error = null;
      })
      .addCase(fetchReceivers.fulfilled, (state, { payload }) => {
        if (state.receivers.requestKey !== payload.requestKey) {
          return;
        }

        state.receivers.status = "succeeded";
        state.receivers.items = payload.items;
        state.receivers.meta = payload.meta;
      })
      .addCase(fetchReceivers.rejected, (state, { payload, error }) => {
        if (
          payload?.requestKey &&
          state.receivers.requestKey !== payload.requestKey
        ) {
          return;
        }

        state.receivers.status = "failed";
        state.receivers.items = [];
        state.receivers.error = payload?.message || error.message;
      })
      .addCase(createTransfer.pending, (state) => {
        state.transferCreate.status = "loading";
        state.transferCreate.error = null;
      })
      .addCase(createTransfer.fulfilled, (state) => {
        state.transferCreate.status = "succeeded";
      })
      .addCase(createTransfer.rejected, (state, { payload, error }) => {
        state.transferCreate.status = "failed";
        state.transferCreate.error = payload || error.message;
      })
      .addCase(confirmTransferPin.pending, (state) => {
        state.pinConfirm.status = "loading";
        state.pinConfirm.error = null;
      })
      .addCase(confirmTransferPin.fulfilled, (state) => {
        state.pinConfirm.status = "succeeded";
      })
      .addCase(confirmTransferPin.rejected, (state, { payload, error }) => {
        state.pinConfirm.status = "failed";
        state.pinConfirm.error = payload || error.message;
      });
  },
});

export default transactionSlice.reducer;
