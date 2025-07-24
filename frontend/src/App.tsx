// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch from react-redux
import { useEffect } from "react";
import { login } from "./slices/authSlice"; // Import the login action from authSlice
import { getCookie } from "./utils/cookies"; // Import the function to get cookies
import type { RootState } from "./store"; // Make sure you're using Redux state to manage auth

import ProfileCreation from "./pages/account/ProfileCreationPage";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/profile/UserProfilePage";
import LikedProfilePage from "./pages/profile/LikedProfilePage";
import PetProfilePage from "./pages/explore/PetProfilePage";
import MessengerPage from "./pages/explore/MessengerPage";
import ExplorePage from "./pages/explore/ExplorePage";
import ChatRoomPage from "./pages/explore/ChatRoomPage";
import HelpPage from "./pages/basic/HelpPage";
import LoginPage from "./pages/account/LoginPage";
import SignupPage from "./pages/account/SignupPage";
import ProfileUpdatePage from "./pages/profile/ProfileUpdatePage";
import AdminPage from "./pages/admin/AdminPage";
import SwipePage from "./pages/explore/SwipePage";

export default function App() {
  const dispatch = useDispatch();
  const accountId = useSelector((state: RootState) => state.auth.accountId); // Get accountId from Redux

  // Sync Redux state with cookies on page load
  useEffect(() => {
    const cookieAccountId = getCookie("accountId"); // Check for accountId in cookies
    if (cookieAccountId && !accountId) {
      dispatch(login(cookieAccountId)); // Update Redux with accountId from cookies
    }
  }, [accountId, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/swipe" element={<SwipePage />} />
      <Route path="/profile/:id" element={<PetProfilePage />} />
      <Route path="/profile-creation" element={<ProfileCreation />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
      <Route path="/liked-profile" element={<LikedProfilePage />} />
      <Route path="/messenger" element={<MessengerPage />} />
      <Route path="/chat/:otherUserId" element={<ChatRoomPage />} />
      <Route path="/profile-update/:id" element={<ProfileUpdatePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
