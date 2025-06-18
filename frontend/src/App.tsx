import { Routes, Route } from "react-router-dom";
import Explore from "./pages/basic/Explore";
import Home from "./pages/Home";
import Help from "./pages/basic/Help";
import Login from "./pages/account/Login";
import Signup from "./pages/account/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/help" element={<Help />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
