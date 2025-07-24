import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../utils/logout"; // Import logoutUser

interface DeleteButtonProps {
  accountId: string;
  onDeleteSuccess?: () => void; // Optional callback
}

export default function DeleteButton({
  accountId,
  onDeleteSuccess,
}: DeleteButtonProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch to trigger actions
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5074/api";

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This will permanently remove:\n" +
        "- Your account information\n" +
        "- Your pet profile\n" +
        "- All your chat messages"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${apiUrl}/accounts/${accountId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Unified logout logic
        logoutUser(dispatch); // Dispatch logout to reset Redux and clear cookies

        // Optional callback
        if (onDeleteSuccess) onDeleteSuccess();

        // Redirect
        navigate("/", { state: { accountDeleted: true } });
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(
          `Failed to delete account: ${errorData.message || res.statusText}`
        );
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error - could not connect to server");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      aria-label="Permanently delete account"
    >
      Delete Account
    </button>
  );
}
