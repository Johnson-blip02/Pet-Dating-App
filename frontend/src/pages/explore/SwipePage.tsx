import { useEffect, useState } from "react";
import PetCard from "../../components/cards/PetCard";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";

export default function SwipePage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const navigate = useNavigate();

  const accountId = localStorage.getItem("accountId");
  const petProfileId = localStorage.getItem("petProfileId");

  // Fetch user’s own profile to get their likedUserIds
  const fetchUserLikes = async () => {
    const res = await fetch(`http://localhost:5074/api/users/${petProfileId}`);
    if (!res.ok) throw new Error("Failed to fetch own profile");
    const user = await res.json();
    setUserLikes(user.likedUserIds || []);
  };

  // Fetch all candidates once, excluding self and already liked users
  const initializeCandidates = async () => {
    try {
      const res = await fetch("http://localhost:5074/api/users");
      const data = await res.json();

      const filtered = data.users.filter(
        (u: any) => u.id !== petProfileId && !userLikes.includes(u.id)
      );

      setCandidates(filtered);
    } catch (err) {
      console.error("Failed to fetch user list:", err);
    }
  };

  // Pick a random user
  const showRandomUser = () => {
    if (candidates.length === 0) {
      setCurrentUser(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[randomIndex];

    setCandidates((prev) => prev.filter((u) => u.id !== selected.id));
    setCurrentUser(selected);
  };

  const handleSkip = () => {
    showRandomUser();
  };

  useEffect(() => {
    if (!accountId || !petProfileId) {
      navigate("/");
      return;
    }

    fetchUserLikes().then(initializeCandidates);
  }, [accountId, petProfileId]);

  useEffect(() => {
    if (candidates.length > 0 && !currentUser) {
      showRandomUser();
    }
  }, [candidates]);

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        {currentUser ? (
          <>
            <PetCard {...currentUser} />
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSkip}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No more pets to show.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
