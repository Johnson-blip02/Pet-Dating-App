import type { Heart } from "../../types/heart";
import { getCookie } from "../../utils/cookies";

export default function UnHeartButton({ otherUserId, onHeartSuccess }: Heart) {
  const petProfileId = getCookie("petProfileId");

  if (!petProfileId || !otherUserId) return null;

  // const roomId = `room_${[petProfileId, otherUserId].sort().join("_")}`;

  const handleUnheart = async () => {
    const confirm = window.confirm(
      "WARNING This was also delete your entire chat with them?"
    );
    if (!confirm) return;

    try {
      const unheartRes = await fetch(
        `http://localhost:5074/api/users/${petProfileId}/unheart/${otherUserId}`,
        { method: "PUT" }
      );

      if (!unheartRes.ok) {
        alert("Failed to unheart user.");
        return;
      }

      alert("User unhearted and chat deleted.");
      onHeartSuccess?.(); // 🧠 Call the parent callback
    } catch (error) {
      console.error("Unheart failed:", error);
      alert("An error occurred.");
    }
  };

  return (
    <button
      onClick={handleUnheart}
      className="
        mt-4 px-4 py-3 
        bg-orange-600 rounded-lg 
        text-white font-medium 
        hover:bg-orange-700
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
        transition-all duration-300
        flex items-center justify-center
        overflow-hidden
        group
        relative
        w-12 h-12 hover:w-auto hover:px-6
      "
      aria-label="Unheart and delete chat"
    >
      {/* SVG Icon - always visible */}
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
          d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
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
        Unheart & Delete Chat
      </span>
    </button>
  );
}
