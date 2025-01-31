import { configureStore } from "@reduxjs/toolkit";

import auth from "./auth.slice";
import snackbar from "./snackbar.slice";

export const store = configureStore({
  reducer: {
    auth,
    snackbar,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
