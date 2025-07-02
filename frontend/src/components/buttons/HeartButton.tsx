import type { Heart } from "../../types/heart";
import { getCookie } from "../../utils/cookies";

export default function HeartButton({ otherUserId, onHeartSuccess }: Heart) {
  const petProfileId = getCookie("petProfileId");

  const handleHeart = async () => {
    if (!petProfileId || !otherUserId) {
      alert("Missing account info.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5074/api/users/${petProfileId}/like/${otherUserId}`,
        { method: "PUT" }
      );

      if (!res.ok) {
        alert("Failed to like.");
        return;
      }

      const result = await res.json();
      if (result.match) {
        alert("🎉 It's a match!");
      } else {
        alert("You liked this profile");
      }

      onHeartSuccess?.();
    } catch (error) {
      console.error("Error liking user:", error);
      alert("An error occurred.");
    }
  };

  return (
    <button
      onClick={handleHeart}
      className="
        mt-4 px-4 py-3 
        bg-pink-500 rounded-lg 
        text-white font-medium 
        hover:bg-pink-600
        focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-opacity-50
        transition-all duration-300
        flex items-center justify-center
        overflow-hidden
        group
        relative
        w-12 h-12 hover:w-auto hover:px-6
      "
      aria-label="Like this profile"
    >
      {/* Heart SVG Icon - always visible */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 absolute group-hover:opacity-0 transition-opacity"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>

      {/* Text - hidden by default, shown on hover */}
      <span
        className="
        opacity-0 group-hover:opacity-100 
        whitespace-nowrap
        transition-opacity duration-200
        ml-2
      "
      >
        Like
      </span>
    </button>
  );
}
