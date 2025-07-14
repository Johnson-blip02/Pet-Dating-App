import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatMessage } from "../types/chatMessage";
import type { PetProfile } from "../types/petProfile";

interface ChatState {
  messages: ChatMessage[]; // Store all chat messages
  user: PetProfile | null; // Store the user data for chat
  userNotFound: boolean; // Check if the user is not found
  isUserDeleted: boolean; // Check if the user was deleted
}

const initialState: ChatState = {
  messages: [],
  user: null,
  userNotFound: false,
  isUserDeleted: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload;
    },
    setUser(state, action: PayloadAction<PetProfile | null>) {
      state.user = action.payload;
    },
    setUserNotFound(state, action: PayloadAction<boolean>) {
      state.userNotFound = action.payload;
    },
    setUserDeleted(state, action: PayloadAction<boolean>) {
      state.isUserDeleted = action.payload;
    },
    clearChatState(state) {
      state.messages = [];
      state.user = null;
      state.userNotFound = false;
      state.isUserDeleted = false;
    },
  },
});

export const {
  setMessages,
  setUser,
  setUserNotFound,
  setUserDeleted,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
