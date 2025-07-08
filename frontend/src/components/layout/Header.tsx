import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { logout } from "../../slices/authSlice";
import { getCookie, deleteCookie } from "../../utils/cookies";
import { logoutUser } from "../../utils/logout";
import type { RootState } from "../../store";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const accountId = useSelector((state: RootState) => state.auth.accountId);
  const petProfileId = useSelector(
    (state: RootState) => state.auth.petProfileId
  );

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Auth check running - current cookies:", document.cookie);
    const currentAccountId = getCookie("accountId");
    if (currentAccountId) {
      fetch(`http://localhost:5074/api/accounts/${currentAccountId}`)
        .then((res) => res.json())
        .then((account) => {
          setIsAdmin(account.role === "Admin");
        })
        .catch((err) => {
          console.error("Admin check failed:", err);
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [location]);

  const handleLogout = () => {
    console.log("Logout initiated");
    logoutUser(dispatch); // Using the centralized logout function
    setIsAdmin(false);
    navigate("/"); // Navigate to home page
  };

  const isLoggedIn = !!accountId;
  const isProfileComplete = !!petProfileId;

  return (
    <header style={{ backgroundColor: "#F79B72" }} className="shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <Link to="/">PetMatch</Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          {isLoggedIn && isProfileComplete && (
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
          {isAdmin && (
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
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
