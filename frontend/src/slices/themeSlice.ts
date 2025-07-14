import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: "light", // Default mode is light
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      // Toggle between light and dark modes
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      // Set the theme directly based on payload
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
