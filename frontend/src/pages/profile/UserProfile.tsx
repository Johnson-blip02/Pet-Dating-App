import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCookie } from "../../utils/cookies"; // Import cookie utility
import type { Account } from "../../types/account";
import type { PetProfile } from "../../types/petProfile";

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const accountId = getCookie("accountId"); // Use cookie instead of localStorage

    if (!accountId) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5074/api/accounts/${accountId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch account");
        return res.json();
      })
      .then((data) => {
        setAccount(data);

        const petProfileId = getCookie("petProfileId") || data.petProfileId;
        if (!petProfileId) {
          navigate("/profile-creation");
        } else {
          fetch(`http://localhost:5074/api/users/${petProfileId}`)
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch pet profile");
              return res.json();
            })
            .then(setPetProfile)
            .catch((err) => {
              console.error(err);
              setError("Failed to load pet profile");
            });
        }
      })
      .catch((err) => {
        console.error(err);
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
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {account.email}
            </p>
            <p>
              <strong>Role:</strong> {account.role}
            </p>
          </div>

          {petProfile ? (
            <div className="mt-6 space-y-2">
              <h3 className="text-xl font-semibold">Pet Profile</h3>
              <p>
                <strong>Name:</strong> {petProfile.userName}
              </p>
              <p>
                <strong>Age:</strong> {petProfile.age}
              </p>
              <p>
                <strong>Type:</strong> {petProfile.petType}
              </p>
              <p>
                <strong>Location:</strong> {petProfile.location}
              </p>
              {petProfile.photoPath && (
                <img
                  src={`http://localhost:5074/${petProfile.photoPath.replace(
                    /^\/+/,
                    ""
                  )}`}
                  alt="Pet"
                  className="w-48 h-48 object-cover rounded mt-2"
                />
              )}
            </div>
          ) : (
            <p className="mt-4 text-yellow-700">No pet profile found</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
