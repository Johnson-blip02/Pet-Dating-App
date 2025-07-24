import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getCookie } from "../../utils/cookies";
import { logoutUser } from "../../utils/logout";
import type { RootState } from "../../store";
import ThemeToggle from "../buttons/ThemeToggle";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accountId = useSelector((state: RootState) => state.auth.accountId);
  const petProfileId = useSelector(
    (state: RootState) => state.auth.petProfileId
  );
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // console.log("Auth check running - current cookies:", document.cookie);

    const currentAccountId = getCookie("accountId");
    const currentPetProfileId = getCookie("petProfileId");

    // Check if the accountId and petProfileId exist in the cookies
    if (currentAccountId && currentPetProfileId) {
      // If both accountId and petProfileId exist, fetch account details
      fetch(`${apiUrl}/accounts/${currentAccountId}`)
        .then((res) => res.json())
        .then((account) => {
          setIsAdmin(account.role === "Admin");
        })
        .catch((err) => {
          console.error("Admin check failed:", err);
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false); // If cookies are missing, set isAdmin to false
    }

    // Dispatch accountId and petProfileId to Redux if present in cookies
    if (currentAccountId) {
      dispatch({ type: "auth/setAccountId", payload: currentAccountId });
    }
    if (currentPetProfileId) {
      dispatch({ type: "auth/setPetProfileId", payload: currentPetProfileId });
    }
  }, [location, dispatch]);

  const handleLogout = () => {
    // console.log("Logout initiated");
    logoutUser(dispatch); // Using the centralized logout function
    setIsAdmin(false);
    navigate("/"); // Navigate to home page
  };

  const isLoggedIn = !!accountId;
  const isProfileComplete = !!petProfileId;

  return (
    <header className="bg-light-accent dark:bg-dark-accent shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-xl font-bold text-light-text dark:text-dark-text">
          <Link to="/">PetMatch</Link>
          <ThemeToggle />
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-light-text dark:text-dark-text focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {isLoggedIn && isProfileComplete && (
            <>
              <Link to="/explore">Explore</Link>
              <Link to="/swipe">Swipe</Link>
              <Link to="/liked-profile">Likes</Link>
              <Link to="/messenger">Messenger</Link>
            </>
          )}
          {isAdmin && <Link to="/admin">Admin</Link>}
          <Link to="/help">Help</Link>
          {isLoggedIn ? (
            <>
              <Link to="/user-profile">My Profile</Link>
              <button onClick={handleLogout} className="text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 py-4 space-y-4 bg-light-accent dark:bg-dark-accent shadow-md rounded-b">
          {isLoggedIn && isProfileComplete && (
            <>
              <Link
                to="/explore"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                Explore
              </Link>
              <Link
                to="/swipe"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                Swipe
              </Link>
              <Link
                to="/liked-profile"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                Likes
              </Link>
              <Link
                to="/messenger"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                Messenger
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block"
            >
              Admin
            </Link>
          )}
          <Link
            to="/help"
            onClick={() => setIsMenuOpen(false)}
            className="block"
          >
            Help
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/user-profile"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block text-left w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
