import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  user: { userName: string; photoPath?: string };
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 border-b shadow-sm bg-white sticky top-0 z-10">
      <button
        onClick={() => navigate("/messenger")}
        className="flex items-center text-gray-700 hover:text-gray-900"
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
            src={`http://localhost:5074/${user.photoPath}`}
            alt={user.userName}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm">
            ?
          </div>
        )}
        <span className="font-semibold text-gray-800">{user.userName}</span>
      </div>
    </div>
  );
}
