import { useEffect, useState } from "react";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { getCookie } from "../../utils/cookies";
import type { PetProfile } from "../../types/petProfile";
import PetCard from "../../components/cards/PetCard";

export default function LikedProfilePage() {
  const [profile, setProfile] = useState<PetProfile | null>(null);
  const [likedUsers, setLikedUsers] = useState<PetProfile[]>([]);
  const [likedByUsers, setLikedByUsers] = useState<PetProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accountId = getCookie("accountId");
    if (!accountId) {
      alert("You must be logged in.");
      return;
    }

    fetch(`http://localhost:5074/api/accounts/${accountId}`)
      .then((res) => res.json())
      .then((account) => {
        if (!account.petProfileId) {
          alert("Please create your pet profile first.");
          return;
        }

        fetch(`http://localhost:5074/api/users/${account.petProfileId}`)
          .then((res) => res.json())
          .then(async (profileData) => {
            setProfile(profileData);

            const fetchUserSafe = async (
              id: string
            ): Promise<PetProfile | null> => {
              try {
                const res = await fetch(
                  `http://localhost:5074/api/users/${id}`
                );
                if (!res.ok) return null;
                return await res.json();
              } catch {
                return null;
              }
            };

            const likedRaw = await Promise.all(
              profileData.likedUserIds.map(fetchUserSafe)
            );
            const likedByRaw = await Promise.all(
              profileData.likedByUserIds.map(fetchUserSafe)
            );

            const liked = likedRaw.filter((u): u is PetProfile => u !== null);
            const likedBy = likedByRaw.filter(
              (u): u is PetProfile => u !== null
            );

            setLikedUsers(liked);
            setLikedByUsers(likedBy);
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return <p className="text-center mt-10">Profile not found.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Likes Overview</h2>

          {/* Liked Profiles */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Liked Profiles</h3>
            {likedUsers.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {likedUsers.map((user) => (
                  <PetCard key={user.id} {...user} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                You haven't liked anyone yet.
              </p>
            )}
          </div>

          {/* Who Liked You */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Who Liked You</h3>
            {likedByUsers.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {likedByUsers.map((user) => (
                  <PetCard key={user.id} {...user} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No one has liked you yet.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
