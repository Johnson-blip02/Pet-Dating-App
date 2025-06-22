import { useEffect, useState } from "react";
import PetCard from "../../components/cards/PetCard";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function Explore() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6; // cards per page
  const totalPages = Math.ceil(totalCount / limit);
  const [filters, setFilters] = useState({
    petType: "",
    location: "",
    minAge: "",
    maxAge: "",
  });

  const fetchUsers = async () => {
    const params = new URLSearchParams();
    if (filters.petType) params.append("petType", filters.petType);
    if (filters.location) params.append("location", filters.location);
    if (filters.minAge) params.append("minAge", filters.minAge);
    if (filters.maxAge) params.append("maxAge", filters.maxAge);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const res = await fetch(
      `http://localhost:5074/api/users?${params.toString()}`
    );
    const data = await res.json();
    setUsers(data.users);
    setTotalCount(data.totalCount);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, page]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Explore Pets</h2>

        {/* Fitler */}
        <div className="mb-6">
          <details className="bg-gray-100 rounded-md p-4 shadow cursor-pointer open:shadow-md">
            <summary className="font-semibold text-gray-800 select-none">
              Filter Options
            </summary>

            <div className="mt-4 flex flex-wrap gap-4">
              <select
                className="border rounded p-2"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, petType: e.target.value }))
                }
              >
                <option value="">All Types</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>

              <input
                type="text"
                placeholder="Location"
                className="border rounded p-2"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, location: e.target.value }))
                }
              />

              <input
                type="number"
                placeholder="Min Age"
                className="border rounded p-2 w-24"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minAge: e.target.value }))
                }
              />

              <input
                type="number"
                placeholder="Max Age"
                className="border rounded p-2 w-24"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxAge: e.target.value }))
                }
              />
            </div>
          </details>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user: any) => (
            <PetCard key={user.id} {...user} />
          ))}
        </div>

        <div className="flex justify-center mt-8 flex-wrap gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded border ${
                p === page ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              } hover:bg-gray-200`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
