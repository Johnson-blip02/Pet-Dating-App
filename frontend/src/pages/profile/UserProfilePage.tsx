import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const accountId = getCookie("accountId");
    if (!accountId) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5074/api/accounts/${accountId}`)
      .then((res) => res.json())
      .then((data) => {
        setAccount(data);
        const petProfileId = getCookie("petProfileId") || data.petProfileId;
        if (!petProfileId) {
          navigate("/profile-creation");
        } else {
          fetch(`http://localhost:5074/api/users/${petProfileId}`)
            .then((res) => res.json())
            .then(setPetProfile)
            .catch(() => setError("Failed to load pet profile"));
        }
      })
      .catch(() => {
        setError("Failed to load account information");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

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
