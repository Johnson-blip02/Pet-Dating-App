import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/basic/Help";
import Login from "./pages/account/Login";
import Signup from "./pages/account/Signup";
import Explore from "./pages/explore/Explore";
import PetProfile from "./pages/explore/PetProfile";
import ProfileCreation from "./pages/account/ProfileCreation";
import UserProfile from "./pages/profile/UserProfile";
import LikedProfile from "./pages/profile/LikedProfile";
import Messenger from "./pages/explore/Messenger";
import ChatRoom from "./pages/explore/ChatRoom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help" element={<Help />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/profile/:id" element={<PetProfile />} />
      <Route path="/profile-creation" element={<ProfileCreation />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/liked-profile" element={<LikedProfile />} />
      <Route path="/messenger" element={<Messenger />} />
      <Route path="/chat/:otherUserId" element={<ChatRoom />} />
    </Routes>
  );
}
