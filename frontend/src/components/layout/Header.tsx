import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCookie, deleteCookie } from "../../utils/cookies";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPetProfile, setHasPetProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check both accountId and petProfileId for more reliable auth state
    const accountExists = !!getCookie("accountId");
    const petProfileExists = !!getCookie("petProfileId");
    setIsLoggedIn(accountExists);
    setHasPetProfile(petProfileExists);
  }, [location]);

  const handleLogout = () => {
    // Delete all auth-related cookies
    deleteCookie("accountId");
    deleteCookie("petProfileId");

    // Clear localStorage if used
    localStorage.removeItem("accountId");
    localStorage.removeItem("petProfileId");

    // Update state and redirect
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header style={{ backgroundColor: "#F79B72" }} className="shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <Link to="/">PetMatch</Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          {isLoggedIn && hasPetProfile && (
            <>
              <Link to="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </Link>
              <Link
                to="/liked-profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Likes
              </Link>
              <Link
                to="/messenger"
                className="text-gray-600 hover:text-gray-900"
              >
                Messenger
              </Link>
            </>
          )}
          <Link to="/help" className="text-gray-600 hover:text-gray-900">
            Help
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <Link
                to="/user-profile"
                className="text-gray-600 hover:text-gray-900"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
