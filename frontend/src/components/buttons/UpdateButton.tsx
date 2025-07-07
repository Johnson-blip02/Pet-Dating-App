import { useNavigate } from "react-router-dom";

interface UpdateButtonProps {
  petProfileId: string;
}

export default function UpdateButton({ petProfileId }: UpdateButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/profile-update/${petProfileId}`)}
      className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Update Profile
    </button>
  );
}
