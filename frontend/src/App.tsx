import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/basic/Help";
import Login from "./pages/account/Login";
import Signup from "./pages/account/Signup";
import Explore from "./pages/explore/Explore";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help" element={<Help />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/explore" element={<Explore />} />
    </Routes>
  );
}
