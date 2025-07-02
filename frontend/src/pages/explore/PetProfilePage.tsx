import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCookie } from "../../utils/cookies";
import UnHeartButton from "../../components/buttons/UnHeartButton";
import HeartButton from "../../components/buttons/HeartButton";

export default function PetProfilePage() {
  const { id: likedId } = useParams(); // profile being viewed
  const [user, setUser] = useState<any>(null);
  const [isHeart, setIsHeart] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const currentUserId = getCookie("petProfileId");

    console.log("Fetching viewed user:", likedId);

    fetch(`http://localhost:5074/api/users/${likedId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch viewed user");
        return res.json();
      })
      .then((viewedUser) => {
        console.log("Fetched viewed user:", viewedUser);
        if (isMounted) setUser(viewedUser);
      })
      .catch((err) => {
        console.error("Error fetching viewed user:", err);
      });

    if (currentUserId && likedId) {
      console.log("Fetching current user:", currentUserId);
      fetch(`http://localhost:5074/api/users/${currentUserId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch current user");
          return res.json();
        })
        .then((currentUser) => {
          console.log("Fetched current user:", currentUser);
          if (isMounted && currentUser.likedUserIds?.includes(likedId)) {
            setIsHeart(true);
          }
        })
        .catch((err) => {
          console.error("Error fetching current user:", err);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [likedId]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <img
          src={`http://localhost:5074/${user.photoPath}`}
          alt={user.userName}
          className="w-full h-80 object-cover rounded-xl shadow mb-6"
        />
        <h2 className="text-3xl font-bold">{user.userName}</h2>
        <p className="text-gray-600 mb-2">
          {user.petType} · {user.age} years old
        </p>
        <p className="text-gray-500 mb-4">{user.location}</p>
        <p className="mb-4">
          <strong>Preferences:</strong> {user.petPreferences?.join(", ")}
        </p>
        {!isHeart && likedId && (
          <HeartButton
            otherUserId={likedId}
            onHeartSuccess={() => setIsHeart(true)}
          />
        )}
        {isHeart && likedId && (
          <UnHeartButton
            otherUserId={likedId}
            onHeartSuccess={() => setIsHeart(false)}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
