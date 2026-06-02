import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { LoadingOverlay } from "@components/molecules";
import { ConfirmRoot } from "@components/organisms";

import "./globals.css";
import AppRouter from "./AppRouter.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<LoadingOverlay />} persistor={persistor}>
      <StrictMode>
        <BrowserRouter>
          <ToastContainer
            stacked
            position="top-right"
            autoClose={3000}
            theme="colored"
          />
          <ConfirmRoot />
          <AppRouter />
        </BrowserRouter>
      </StrictMode>
    </PersistGate>
  </Provider>,
);
