import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE
} from "redux-persist";
import storage from "redux-persist/es/storage";

import userLoginReducer from "./slices/userLogin";
import accountReducer from "./slices/account";
import transactionReducer from "./slices/transaction";
import { getEnv } from '@utils';

const userLoginPersistConfig = {
  key: "userLogin",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  userLogin: persistReducer(userLoginPersistConfig, userLoginReducer),
  account: accountReducer,
  transaction: transactionReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: getEnv.env === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
