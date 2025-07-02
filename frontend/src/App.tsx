import { Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/profile/:id" element={<PetProfilePage />} />
      <Route path="/profile-creation" element={<ProfileCreation />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
      <Route path="/liked-profile" element={<LikedProfilePage />} />
      <Route path="/messenger" element={<MessengerPage />} />
      <Route path="/chat/:otherUserId" element={<ChatRoomPage />} />
    </Routes>
  );
}
