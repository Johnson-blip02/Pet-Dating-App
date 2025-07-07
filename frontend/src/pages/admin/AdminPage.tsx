import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookies";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import UpdateButton from "../../components/buttons/UpdateButton";
import DeleteButton from "../../components/buttons/DeleteButton";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const accountId = getCookie("accountId");

  useEffect(() => {
    if (!accountId) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      // Get petProfileId of current account
      const resAccount = await fetch(
        `http://localhost:5074/api/accounts/${accountId}`
      );
      const account = await resAccount.json();
      const petProfileId = account.petProfileId;

      // Fetch all users
      const resUsers = await fetch("http://localhost:5074/api/users/all");
      const allUsers = await resUsers.json();

      // Filter out the current user's pet profile
      const filtered = allUsers.filter((u: any) => u.id !== petProfileId);
      setUsers(filtered);
    };

    fetchUsers();
  }, [accountId, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Admin - Manage Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Pet Type</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Photo</th>
                <th className="p-2 border w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="text-center">
                  <td className="p-2 border">{user.userName}</td>
                  <td className="p-2 border">{user.petType}</td>
                  <td className="p-2 border">{user.location}</td>
                  <td className="p-2 border">
                    <img
                      src={`http://localhost:5074/${user.photoPath}`}
                      alt="pet"
                      className="w-12 h-12 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="p-2 border w-40 whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      <UpdateButton petProfileId={user.id} />
                      <DeleteButton accountId={user.id} />
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
