import { createSlice } from "@reduxjs/toolkit";

interface State {
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

const initialState: State = {
  open: false,
  message: "",
  severity: "info",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    set: (state, action: { payload: State; type: string }) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { set } = snackbarSlice.actions;
export default snackbarSlice.reducer;
