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
  const accountId = useSelector((state: RootState) => state.auth.accountId);
  const petProfileId = useSelector(
    (state: RootState) => state.auth.petProfileId
  );

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Auth check running - current cookies:", document.cookie);

    const currentAccountId = getCookie("accountId");
    const currentPetProfileId = getCookie("petProfileId");

    // Check if the accountId and petProfileId exist in the cookies
    if (currentAccountId && currentPetProfileId) {
      // If both accountId and petProfileId exist, fetch account details
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
    console.log("Logout initiated");
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

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          {isLoggedIn && isProfileComplete && (
            <>
              <Link
                to="/explore"
                className="text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
              >
                Explore
              </Link>
              <Link
                to="/swipe"
                className="text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
              >
                Swipe
              </Link>
              <Link
                to="/liked-profile"
                className="text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
              >
                Likes
              </Link>
              <Link
                to="/messenger"
                className="text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
              >
                Messenger
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
            >
              Admin
            </Link>
          )}
          <Link
            to="/help"
            className="text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
          >
            Help
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <Link
                to="/user-profile"
                className="text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-light-text/30 dark:border-dark-text/30 rounded hover:bg-light-background/10 dark:hover:bg-dark-background/10 text-sm text-light-text dark:text-dark-text"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-light-text/30 dark:border-dark-text/30 rounded hover:bg-light-background/10 dark:hover:bg-dark-background/10 text-sm text-light-text dark:text-dark-text"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-light-text text-light-background rounded hover:bg-light-text/90 text-sm dark:bg-dark-text dark:text-dark-background dark:hover:bg-dark-text/90"
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
