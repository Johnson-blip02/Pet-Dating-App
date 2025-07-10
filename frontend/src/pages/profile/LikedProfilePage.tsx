import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLikedUsers, setLikedByUsers } from "../../slices/likeSlice"; // Import Redux actions
import { getCookie } from "../../utils/cookies";
import PetCard from "../../components/cards/PetCard";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import type { RootState } from "../../store"; // Import RootState to access the Redux state
import type { PetProfile } from "../../types/petProfile";

export default function LikedProfilePage() {
  const dispatch = useDispatch();
  const likedUsers = useSelector((state: RootState) => state.like.likedUsers); // Get liked users from Redux store
  const likedByUsers = useSelector(
    (state: RootState) => state.like.likedByUsers
  ); // Get liked by users from Redux store
  const accountId = getCookie("accountId");

  useEffect(() => {
    if (!accountId) {
      alert("You must be logged in.");
      return;
    }

    // Fetch account data to retrieve petProfileId
    fetch(`http://localhost:5074/api/accounts/${accountId}`)
      .then((res) => res.json())
      .then((account) => {
        if (!account.petProfileId) {
          alert("Please create your pet profile first.");
          return;
        }

        // Fetch pet profile data
        fetch(`http://localhost:5074/api/users/${account.petProfileId}`)
          .then((res) => res.json())
          .then(async (profileData: PetProfile) => {
            // Function to fetch user profiles by userIds
            const fetchUserProfiles = async (ids: string[]) => {
              const userProfiles: PetProfile[] = [];
              for (const id of ids) {
                const res = await fetch(
                  `http://localhost:5074/api/users/${id}`
                );
                if (res.ok) {
                  const user = await res.json();
                  userProfiles.push(user);
                }
              }
              return userProfiles;
            };

            // Fetch the full user data for liked users and liked-by users
            const likedUserProfiles = await fetchUserProfiles(
              profileData.likedUserIds
            );
            const likedByUserProfiles = await fetchUserProfiles(
              profileData.likedByUserIds
            );

            // Dispatch Redux actions to store liked and liked-by users in the Redux store
            dispatch(setLikedUsers(likedUserProfiles)); // Dispatch liked users
            dispatch(setLikedByUsers(likedByUserProfiles)); // Dispatch liked by users
          })
          .catch(console.error);
      });
  }, [accountId, dispatch]);

  if (!likedUsers || !likedByUsers)
    return <p className="text-center mt-10">Loading...</p>;

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
                {likedUsers.map((user: PetProfile) => (
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
                {likedByUsers.map((user: PetProfile) => (
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
