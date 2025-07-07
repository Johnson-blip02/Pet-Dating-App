import { useNavigate, useLocation, Link } from "react-router-dom";
import { deleteCookie, getCookie } from "../../utils/cookies";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { logoutUser } from "../../utils/logout";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId, setAccountId } = useAuth();

  const [hasPetProfile, setHasPetProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const petProfileExists = !!getCookie("petProfileId");
    setHasPetProfile(petProfileExists);

    // Check if user is admin
    const currentAccountId = getCookie("accountId");
    if (currentAccountId) {
      fetch(`http://localhost:5074/api/accounts/${currentAccountId}`)
        .then((res) => res.json())
        .then((account) => {
          setIsAdmin(account.role === "Admin");
        })
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [location, accountId]);

  const handleLogout = () => {
    logoutUser(setAccountId);
    setIsAdmin(false);
    navigate("/");
  };

  const isLoggedIn = !!accountId;

  return (
    <header style={{ backgroundColor: "#F79B72" }} className="shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <Link to="/">PetMatch</Link>
        </div>

        {/* Navigation */}
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
