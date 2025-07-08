// src/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accountId: string | null;
  petProfileId: string | null;
}

const initialState: AuthState = {
  accountId: null,
  petProfileId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.accountId = action.payload;
    },
    logout(state) {
      state.accountId = null;
      state.petProfileId = null;
    },
    setPetProfileId(state, action: PayloadAction<string | null>) {
      state.petProfileId = action.payload;
    },
  },
});

export const { login, logout, setPetProfileId } = authSlice.actions;
export default authSlice.reducer;
