import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile, PetProfile } from "../types/profile";

interface ProfileState {
  userProfile: UserProfile | null;
  petProfile: PetProfile | null;
}

const initialState: ProfileState = {
  userProfile: null,
  petProfile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.userProfile = action.payload;
    },
    setPetProfile(state, action: PayloadAction<PetProfile>) {
      state.petProfile = action.payload;
    },
    // Reset profiles when logging out or user switches
    resetProfiles(state) {
      state.userProfile = null;
      state.petProfile = null;
    },
  },
});

export const { setUserProfile, setPetProfile, resetProfiles } =
  profileSlice.actions;

export default profileSlice.reducer;
