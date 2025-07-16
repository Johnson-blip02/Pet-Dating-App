import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookies";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import UpdateButton from "../../components/buttons/UpdateButton";
import AdminDeleteButton from "../../components/buttons/AdminDeleteButton";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const accountId = getCookie("accountId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const photoUrl = import.meta.env.VITE_PHOTO_URL;

  useEffect(() => {
    if (!accountId) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        // Get current account details
        const resAccount = await fetch(`${apiUrl}/accounts/${accountId}`);
        const account = await resAccount.json();

        if (account.role !== "Admin") {
          navigate("/"); // Redirect if the user is not an admin
          return;
        }

        const petProfileId = account.petProfileId;

        // Fetch all users
        const resUsers = await fetch(`${apiUrl}/users/all`);
        const allUsers = await resUsers.json();

        // Filter out the current user's pet profile
        const filtered = allUsers.filter((u: any) => u.id !== petProfileId);
        setUsers(filtered);
      } catch (error) {
        console.error("Error fetching users:", error);
        navigate("/"); // Redirect on error
      }
    };

    fetchUsers();
  }, [accountId, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Header />
      <main className="p-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Admin - Manage Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-600 text-sm">
            <thead className="bg-light-accent dark:bg-dark-accent text-black dark:text-white">
              <tr>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Username
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Pet Type
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Location
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Photo
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600 w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr
                  key={user.id}
                  className="text-center border border-gray-300 dark:border-gray-600"
                >
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.userName}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.petType}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.location}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    <img
                      src={`${photoUrl}/${user.photoPath}`}
                      alt="pet"
                      className="w-12 h-12 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600 w-40 whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      <UpdateButton petProfileId={user.id} />
                      <AdminDeleteButton userId={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
