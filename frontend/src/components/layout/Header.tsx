import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCookie, deleteCookie } from "../../utils/cookies";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // to re-check on every route change

  useEffect(() => {
    const cookieExists = !!getCookie("accountId");
    setIsLoggedIn(cookieExists);
  }, [location]); // re-run when route changes

  const handleLogout = () => {
    deleteCookie("accountId");
    localStorage.removeItem("accountId");
    setIsLoggedIn(false); // update local state
    navigate("/signup");
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
          {isLoggedIn && (
            <Link to="/explore" className="text-gray-600 hover:text-gray-900">
              Explore
            </Link>
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
