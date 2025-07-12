import { Link } from "react-router-dom";
import type { PetProfile } from "../../types/petProfile";

export default function PetCard(props: PetProfile) {
  const { userName, age, petType, location, photoPath, id } = props;

  return (
    <Link to={`/profile/${id}`} className="block">
      <div className="bg-light-background shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
        <img
          src={`http://localhost:5074/${photoPath}`}
          alt={userName}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-light-text">{userName}</h3>
          <p className="text-sm text-light-muted">
            {petType} · {age} years old
          </p>
          <p className="text-sm text-light-muted">{location}</p>
        </div>
      </div>
    </Link>
  );
}
