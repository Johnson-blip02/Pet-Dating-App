import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMatches } from "../../slices/likeSlice"; // Import Redux actions
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCookie } from "../../utils/cookies";
import type { RootState } from "../../store"; // Import RootState to access Redux state
import type { MatchUser } from "../../types/match";

export default function MessengerPage() {
  const dispatch = useDispatch();
  const matches = useSelector((state: RootState) => state.like.matches); // Get matches from Redux store
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const petProfileId = getCookie("petProfileId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const photoUrl = import.meta.env.VITE_PHOTO_URL;

  useEffect(() => {
    if (!petProfileId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/${petProfileId}/matches`);
        const data = await res.json();
        const matchesData = Array.isArray(data) ? data : data.users ?? [];
        dispatch(setMatches(matchesData)); // Dispatch matches to Redux
      } catch (err) {
        // Type guard to check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message); // Access message if it's an Error
        } else {
          setError("An unexpected error occurred.");
        }
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches(); // Fetch matches on mount
  }, [petProfileId, dispatch]); // Only depend on petProfileId

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Header />

      <main className="flex-grow p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Matches</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : matches.length === 0 ? (
          <p>No matches yet.</p>
        ) : (
          <div className="space-y-2">
            {matches.map((user: MatchUser) => (
              <div
                key={user.id}
                onClick={() => navigate(`/chat/${user.id}`)}
                className="flex items-center gap-3 p-3 bg-light-background dark:bg-dark-muted shadow rounded cursor-pointer hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition-colors"
              >
                <img
                  src={`${photoUrl}/${user.photoPath.replace(/^\/+/, "")}`}
                  alt={user.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.userName}</p>
                  <p className="text-light-secondary-text dark:text-dark-secondary-text text-sm">
                    {user.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
