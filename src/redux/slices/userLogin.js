import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password: _password, pin: _pin, ...safeUser } = user;
  return safeUser;
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
    },
  },
});

export const userLoginAction = { ...userLoginSlice.actions };
export default userLoginSlice.reducer;
