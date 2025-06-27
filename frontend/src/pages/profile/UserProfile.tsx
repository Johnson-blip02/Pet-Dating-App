import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import type { Account } from "../../types/account";
import type { PetProfile } from "../../types/petProfile";

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);

  useEffect(() => {
    const accountId = localStorage.getItem("accountId");

    if (!accountId) {
      navigate("/profile-creation");
      return;
    }

    fetch(`http://localhost:5074/api/accounts/${accountId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch account");
        return res.json();
      })
      .then((data) => {
        setAccount(data);

        if (!data.petProfileId) {
          navigate("/profile-creation");
        } else {
          // Fetch pet profile
          fetch(`http://localhost:5074/api/users/${data.petProfileId}`)
            .then((res) => res.json())
            .then(setPetProfile)
            .catch(console.error);
        }
      })
      .catch((err) => {
        console.error(err);
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
          <p>
            <strong>Email:</strong> {account.email}
          </p>
          <p>
            <strong>Role:</strong> {account.role}
          </p>

          {petProfile ? (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-2">Pet Profile</h3>
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
              <img
                src={`http://localhost:5074/${petProfile.photoPath}`}
                alt="Pet"
                className="w-48 h-48 object-cover rounded mt-2"
              />
            </>
          ) : (
            <p className="mt-4 text-yellow-700">Loading pet profile...</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
