// components/Messenger.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCookie } from "../../utils/cookies";
import type { MatchUser } from "../../types/match";

export default function MessengerPage() {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const petProfileId = getCookie("petProfileId");

  useEffect(() => {
    if (!petProfileId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5074/api/users/${petProfileId}/matches`)
      .then((res) => res.json())
      .then((data) => {
        const matchesData = Array.isArray(data) ? data : data.users ?? [];
        setMatches(matchesData);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [petProfileId]);

  return (
    <div className="min-h-screen flex flex-col">
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
            {matches.map((user) => (
              <div
                key={user.id}
                onClick={() => navigate(`/chat/${user.id}`)}
                className="flex items-center gap-3 p-3 bg-white shadow rounded cursor-pointer hover:bg-blue-50"
              >
                <img
                  src={`http://localhost:5074/${user.photoPath.replace(
                    /^\/+/,
                    ""
                  )}`}
                  alt={user.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.userName}</p>
                  <p className="text-sm text-gray-500">{user.location}</p>
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
