import { useNavigate } from "react-router-dom";

interface AdminDeleteButtonProps {
  userId: string; // Receive the userId from the AdminPage
  onDeleteSuccess?: () => void; // Optional callback to handle success
}

export default function AdminDeleteButton({
  userId,
  onDeleteSuccess,
}: AdminDeleteButtonProps) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this account? This will permanently remove:\n" +
        "- The account information\n" +
        "- The pet profile\n" +
        "- All chat messages"
    );
    if (!confirm) return;

    try {
      // First, fetch the accountId associated with the userId
      const accountRes = await fetch(
        `http://localhost:5074/api/accounts/user/${userId}`
      );

      if (!accountRes.ok) {
        const errorData = await accountRes.json();
        alert(
          `Failed to fetch account details: ${
            errorData.message || accountRes.statusText
          }`
        );
        console.error(
          `Failed to fetch account details. Status: ${accountRes.status}`
        );
        console.error("Error Data:", errorData);
        return;
      }

      const accountData = await accountRes.json();

      if (!accountData || !accountData.id) {
        alert("Failed to fetch account details.");
        return;
      }

      const accountId = accountData.id;

      // Proceed with the delete operation
      const res = await fetch(
        `http://localhost:5074/api/accounts/${accountId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        // Optional callback
        if (onDeleteSuccess) onDeleteSuccess();

        // Redirect to the home page after deletion
        navigate("/admin", { state: { accountDeleted: true } });
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(
          `Failed to delete account: ${errorData.message || res.statusText}`
        );
        console.error(`Failed to delete account. Status: ${res.status}`);
        console.error("Error Data:", errorData);
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
