import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setUserProfile, setPetProfile } from "../../slices/profileSlice";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProfileInfoCard from "../../components/cards/ProfileInfoCard";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access accountId and petProfileId from Redux store
  const { accountId, petProfileId } = useSelector(
    (state: RootState) => state.auth
  );
  const { userProfile, petProfile } = useSelector(
    (state: RootState) => state.profile
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // If accountId or petProfileId are missing, redirect to appropriate pages
    if (!accountId) {
      console.log("Redirecting to login due to missing accountId");
      navigate("/login");
      return;
    }

    if (!petProfileId) {
      console.log(
        "Redirecting to profile-creation due to missing petProfileId"
      );
      navigate("/profile-creation");
      return;
    }

    // If userProfile is not in Redux, fetch from the server
    if (!userProfile) {
      fetch(`http://localhost:5074/api/accounts/${accountId}`)
        .then((res) => res.json())
        .then((data) => {
          dispatch(setUserProfile(data)); // Dispatch to Redux (Account)
        })
        .catch((err) => {
          setError("Failed to load account information");
          console.error(err);
          navigate("/login");
        });
    }

    // If petProfile is not in Redux, fetch from the server
    if (!petProfile) {
      fetch(`http://localhost:5074/api/users/${petProfileId}`)
        .then((res) => res.json())
        .then((data) => {
          dispatch(setPetProfile(data)); // Dispatch to Redux (PetProfile)
        })
        .catch((err) => {
          setError("Failed to load pet profile");
          console.error(err);
          navigate("/profile-creation");
        });
    }

    setLoading(false); // Stop loading after data is fetched
  }, [accountId, petProfileId, userProfile, petProfile, dispatch, navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!userProfile || !petProfile) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-xl mx-auto">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <ProfileInfoCard account={userProfile} petProfile={petProfile} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
