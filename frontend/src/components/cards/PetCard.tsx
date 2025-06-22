interface PetCardProps {
  userName: string;
  age: number;
  petType: string;
  location: string;
  photoPath: string;
}

export default function PetCard(props: PetCardProps) {
  const { userName, age, petType, location, photoPath } = props;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
  );
}
