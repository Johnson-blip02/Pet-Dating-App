import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setUserProfile, setPetProfile } from "../../slices/profileSlice";
import { getCookie } from "../../utils/cookies";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProfileInfoCard from "../../components/cards/ProfileInfoCard";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Redux values
  const reduxAccountId = useSelector(
    (state: RootState) => state.auth.accountId
  );
  const reduxPetProfileId = useSelector(
    (state: RootState) => state.auth.petProfileId
  );
  const { userProfile, petProfile } = useSelector(
    (state: RootState) => state.profile
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fallback values from cookies
  const accountId = reduxAccountId || getCookie("accountId");
  const petProfileId = reduxPetProfileId || getCookie("petProfileId");

  useEffect(() => {
    // Redirect if missing
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

    // Fetch account if missing
    if (!userProfile) {
      fetch(`${apiUrl}/accounts/${accountId}`)
        .then((res) => res.json())
        .then((data) => dispatch(setUserProfile(data)))
        .catch((err) => {
          console.error(err);
          setError("Failed to load account information");
          navigate("/login");
        });
    }

    // Fetch pet profile if missing
    if (!petProfile) {
      fetch(`${apiUrl}/users/${petProfileId}`)
        .then((res) => res.json())
        .then((data) => dispatch(setPetProfile(data)))
        .catch((err) => {
          console.error(err);
          setError("Failed to load pet profile");
          navigate("/profile-creation");
        });
    }

    setLoading(false);
  }, [
    reduxAccountId,
    reduxPetProfileId,
    accountId,
    petProfileId,
    userProfile,
    petProfile,
    dispatch,
    navigate,
    apiUrl,
  ]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!userProfile || !petProfile) return null;

  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <Header />
      <main className="flex-grow p-6 bg-light-muted dark:bg-dark-muted">
        <div className="max-w-xl mx-auto">
          {error && (
            <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          )}
          <ProfileInfoCard account={userProfile} petProfile={petProfile} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
