import { Link } from "react-router-dom";
import type { PetCardProps } from "../../types/petProfileCard";

export default function PetCard(props: PetCardProps) {
  const { userName, age, petType, location, photoPath, id } = props;

  return (
    <Link to={`/profile/${id}`} className="block">
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
        <img
          src={`http://localhost:5074/${photoPath}`}
          alt={userName}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold">{userName}</h3>
          <p className="text-sm text-gray-600">
            {petType} · {age} years old
          </p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
    </Link>
  );
}
