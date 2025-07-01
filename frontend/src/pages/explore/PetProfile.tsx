import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCookie } from "../../utils/cookies";

export default function PetProfile() {
  const { id: likedId } = useParams(); // profile being viewed
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5074/api/users/${likedId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [likedId]);

  const handleLike = async () => {
    const likerId = getCookie("petProfileId"); // or localStorage.getItem("accountId")
    if (!likerId || !likedId) return alert("Missing account info.");

    const res = await fetch(
      `http://localhost:5074/api/users/${likerId}/like/${likedId}`,
      { method: "PUT" }
    );

    if (!res.ok) return alert("Failed to like.");

    const result = await res.json();
    if (result.match) {
      alert("🎉 It's a match!");
    } else {
      alert("You liked this profile ❤️");
    }
  };

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

        <button
          className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"
          onClick={handleLike}
        >
          ❤️ Like
        </button>
      </div>
      <Footer />
    </>
  );
}
