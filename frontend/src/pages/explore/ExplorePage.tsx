import { useEffect, useState } from "react";
import PetCard from "../../components/cards/PetCard";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import PetFilter from "../../components/filters/PetFilter";
import Pagination from "../../components/navigation/Pagination";

export default function ExplorePage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6; // cards per page
  const totalPages = Math.ceil(totalCount / limit);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    petType: "",
    location: "",
    minAge: "",
    maxAge: "",
  });

  const fetchUsers = async () => {
    const accountId = localStorage.getItem("accountId");

    if (!accountId) {
      navigate("/");
      return;
    }

    let ownPetId = null;
    const resAccount = await fetch(
      `http://localhost:5074/api/accounts/${accountId}`
    );
    const account = await resAccount.json();
    ownPetId = account.petProfileId;

    const params = new URLSearchParams();
    if (filters.petType) params.append("petType", filters.petType);
    if (filters.location) params.append("location", filters.location);
    if (filters.minAge) params.append("minAge", filters.minAge);
    if (filters.maxAge) params.append("maxAge", filters.maxAge);

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const resUsers = await fetch(
      `http://localhost:5074/api/users?${params.toString()}`
    );
    const data = await resUsers.json();

    const filteredUsers = data.users.filter((u: any) => u.id !== ownPetId);
    setUsers(filteredUsers);
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
