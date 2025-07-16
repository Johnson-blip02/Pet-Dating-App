import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  user: { userName: string; photoPath?: string };
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const photoUrl = import.meta.env.VITE_PHOTO_URL;

  return (
    <div className="flex items-center justify-between p-4 border-b shadow-sm bg-light-background dark:bg-dark-border sticky top-0 z-10">
      <button
        onClick={() => navigate("/messenger")}
        className="flex items-center text-black hover:text-gray-700"
        aria-label="Back to Messenger"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </button>

      <div className="flex items-center gap-3">
        {user?.photoPath ? (
          <img
            src={`${photoUrl}/${user.photoPath}`}
            alt={user.userName}
            className="h-10 w-10 rounded-full object-cover border border-light-muted"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-light-muted flex items-center justify-center text-sm text-light-text">
            ?
          </div>
        )}
        <span className="font-semibold text-light-text">{user.userName}</span>
      </div>
    </div>
  );
}
