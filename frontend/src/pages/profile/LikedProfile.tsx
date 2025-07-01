import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { getCookie } from "../../utils/cookies";
import type { PetProfile } from "../../types/petProfile";

export default function LikedProfile() {
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

            // Fetch full profiles for both arrays
            const liked = await Promise.all(
              profileData.likedUserIds.map((id: string) =>
                fetch(`http://localhost:5074/api/users/${id}`).then((res) =>
                  res.json()
                )
              )
            );

            const likedBy = await Promise.all(
              profileData.likedByUserIds.map((id: string) =>
                fetch(`http://localhost:5074/api/users/${id}`).then((res) =>
                  res.json()
                )
              )
            );

            setLikedUsers(liked);
            setLikedByUsers(likedBy);
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      });
  }, []);

  const renderCard = (user: PetProfile) => (
    <Link
      key={user.id}
      to={`/pet/${user.id}`}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition w-full sm:w-64"
    >
      <img
        src={`http://localhost:5074/${user.photoPath}`}
        alt={user.userName}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h4 className="text-lg font-bold">{user.userName}</h4>
      <p className="text-sm text-gray-600">{user.location}</p>
    </Link>
  );

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
                {likedUsers.map(renderCard)}
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
                {likedByUsers.map(renderCard)}
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
