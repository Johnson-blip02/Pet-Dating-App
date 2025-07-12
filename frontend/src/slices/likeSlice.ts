// src/slices/likeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MatchUser } from "../types/match"; // Import MatchUser for match-related actions
import type { PetProfile } from "../types/petProfile"; // For liked users and liked-by users

interface LikeState {
  likedUsers: PetProfile[];
  likedByUsers: PetProfile[];
  matches: MatchUser[]; // Use MatchUser for matches
}

const initialState: LikeState = {
  likedUsers: [],
  likedByUsers: [],
  matches: [],
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    setLikedUsers(state, action: PayloadAction<PetProfile[]>) {
      state.likedUsers = action.payload;
    },
    setLikedByUsers(state, action: PayloadAction<PetProfile[]>) {
      state.likedByUsers = action.payload;
    },
    // Set matches action to update the Redux state with matched users
    setMatches(state, action: PayloadAction<MatchUser[]>) {
      state.matches = action.payload;
    },
    addMatch(state, action: PayloadAction<MatchUser>) {
      state.matches.push(action.payload);
    },
    removeMatch(state, action: PayloadAction<string>) {
      state.matches = state.matches.filter(
        (match) => match.id !== action.payload
      );
    },
    clearMatches(state) {
      state.matches = [];
    },
  },
});

export const {
  setLikedUsers,
  setLikedByUsers,
  setMatches, // Export the setMatches action
  addMatch,
  removeMatch,
  clearMatches,
} = likeSlice.actions;

export default likeSlice.reducer;
