// import { useNavigate } from "react-router-dom";

interface AdminDeleteButtonProps {
  userId: string;
  onDeleteSuccess?: () => void;
}

export default function AdminDeleteButton({
  userId,
  onDeleteSuccess,
}: AdminDeleteButtonProps) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5074/api";

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this account? This will permanently remove:\n" +
        "- The account information\n" +
        "- The pet profile\n" +
        "- All chat messages"
    );
    if (!confirm) return;

    try {
      const accountRes = await fetch(`${apiUrl}/accounts/user/${userId}`);
      if (!accountRes.ok) {
        const errorData = await accountRes.json();
        alert(
          `Failed to fetch account details: ${
            errorData.message || accountRes.statusText
          }`
        );
        return;
      }

      const accountData = await accountRes.json();
      const accountId = accountData.id;
      if (!accountId) {
        alert("Invalid account data returned.");
        return;
      }

      const res = await fetch(`${apiUrl}/accounts/${accountId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        if (onDeleteSuccess) onDeleteSuccess();
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
