import { useEffect, useState } from "react";
import PetCard from "../../components/cards/PetCard";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import PetFilter from "../../components/filters/PetFilter";
import Pagination from "../../components/navigation/Pagination";
import { getCookie } from "../../utils/cookies";

export default function ExplorePage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 8; // cards per page
  const totalPages = Math.ceil(totalCount / limit);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    petType: "",
    location: "",
    minAge: "",
    maxAge: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5074/api";

  const fetchUsers = async () => {
    const accountId = localStorage.getItem("accountId");
    const petProfileId = localStorage.getItem("petProfileId");
    const currentAccountId = getCookie("accountId");
    const currentPetProfileId = getCookie("petProfileId");

    if (!accountId || !petProfileId) {
      if (!currentAccountId || !currentPetProfileId) {
        navigate("/");
        return;
      }
    }

    let ownPetId = null;
    const resAccount = await fetch(`${apiUrl}/accounts/${accountId}`);
    const account = await resAccount.json();
    ownPetId = account.petProfileId;

    const params = new URLSearchParams();
    if (filters.petType) params.append("petType", filters.petType);
    if (filters.location) params.append("location", filters.location);
    if (filters.minAge) params.append("minAge", filters.minAge);
    if (filters.maxAge) params.append("maxAge", filters.maxAge);

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const resUsers = await fetch(`${apiUrl}/users?${params.toString()}`);
    const data = await resUsers.json();

    const filteredUsers = data.users.filter((u: any) => u.id !== ownPetId);
    setUsers(filteredUsers);
    setTotalCount(data.totalCount);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, page]);

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Explore Pets</h2>

        {/* Filter */}
        <PetFilter filters={filters} setFilters={setFilters} />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user: any) => (
            <PetCard key={user.id} {...user} />
          ))}
        </div>

        {/* Pages */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      <Footer />
    </div>
  );
}
