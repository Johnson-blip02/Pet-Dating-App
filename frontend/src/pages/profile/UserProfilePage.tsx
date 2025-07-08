// src/pages/profile/UserProfilePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useDispatch and useSelector from react-redux
import type { RootState } from "../../store"; // Import RootState to access the Redux store
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProfileInfoCard from "../../components/cards/ProfileInfoCard";
import { getCookie } from "../../utils/cookies";
import type { Account } from "../../types/account";
import type { PetProfile } from "../../types/petProfile";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [error, setError] = useState("");

  // Access accountId from Redux store
  const accountId = useSelector((state: RootState) => state.auth.accountId); // Get accountId from Redux store

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5074/api/accounts/${accountId}`)
      .then((res) => res.json())
      .then((data) => {
        setAccount(data);

        // Get petProfileId from cookies or from the fetched data
        const petProfileId = getCookie("petProfileId") || data.petProfileId;

        // If petProfileId is null or empty, navigate to profile-creation
        if (!petProfileId) {
          navigate("/profile-creation");
          return; // Skip further execution if redirecting to profile-creation
        }

        // Only fetch the pet profile if petProfileId exists
        fetch(`http://localhost:5074/api/users/${petProfileId}`)
          .then((res) => res.json())
          .then(setPetProfile)
          .catch(() => {
            setError("Failed to load pet profile");
            navigate("/profile-creation"); // Redirect to profile-creation in case of fetch failure
          });
      })
      .catch(() => {
        setError("Failed to load account information");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [accountId, navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!account) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-xl mx-auto">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <ProfileInfoCard account={account} petProfile={petProfile} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
