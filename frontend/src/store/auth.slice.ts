import { createSlice } from "@reduxjs/toolkit";

type Admin = {
  uuid: string;
  username: string;
  role: "super-admin" | "admin";
  first_name: string;
  last_name?: string;
};

interface State {
  loading?: boolean;
  admin: Admin | null | undefined;
}

const initialState: State = {
  loading: true,
  admin: null,
};

const authSlice = createSlice({
  name: "auth",
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

export const { set } = authSlice.actions;
export default authSlice.reducer;
