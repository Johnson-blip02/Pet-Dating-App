interface PetFilterProps {
  filters: {
    petType: string;
    location: string;
    minAge: string;
    maxAge: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      petType: string;
      location: string;
      minAge: string;
      maxAge: string;
    }>
  >;
}

export default function PetFilter({ filters, setFilters }: PetFilterProps) {
  return (
    <details className="bg-gray-100 rounded-md p-4 shadow cursor-pointer open:shadow-md mb-6">
      <summary className="font-semibold text-gray-800 select-none">
        Filter Options
      </summary>

      <div className="mt-4 flex flex-wrap gap-4">
        <select
          className="border rounded p-2"
          value={filters.petType}
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
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location: e.target.value }))
          }
        />

        <input
          type="number"
          placeholder="Min Age"
          className="border rounded p-2 w-24"
          value={filters.minAge}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minAge: e.target.value }))
          }
        />

        <input
          type="number"
          placeholder="Max Age"
          className="border rounded p-2 w-24"
          value={filters.maxAge}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxAge: e.target.value }))
          }
        />
      </div>
    </details>
  );
}
