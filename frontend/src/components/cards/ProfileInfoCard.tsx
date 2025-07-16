// components/cards/ProfileInfoCard.tsx
import type { Account } from "../../types/account";
import type { PetProfile } from "../../types/petProfile";
import UpdateButton from "../buttons/UpdateButton";
import DeleteButton from "../buttons/DeleteButton";

export default function ProfileInfoCard({
  account,
  petProfile,
}: {
  account: Account;
  petProfile: PetProfile | null;
}) {
  const photoUrl = import.meta.env.VITE_PHOTO_URL;

  return (
    <div className="p-6 rounded shadow space-y-4 bg-light-background text-light-text">
      <h2 className="text-2xl font-bold text-light-accent">My Profile</h2>

      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {account.email}
        </p>
        <p>
          <strong>Role:</strong> {account.role}
        </p>
      </div>

      {petProfile ? (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-light-accent">
            Pet Profile
          </h3>

          <p>
            <strong>Name:</strong> {petProfile.userName}
          </p>
          <p>
            <strong>Age:</strong> {petProfile.age}
          </p>
          <p>
            <strong>Type:</strong> {petProfile.petType}
          </p>
          <p>
            <strong>Location:</strong> {petProfile.location}
          </p>

          {petProfile.photoPath && (
            <img
              src={`${photoUrl}/${petProfile.photoPath.replace(/^\/+/, "")}`}
              alt="Pet"
              className="w-48 h-48 object-cover rounded"
            />
          )}

          <div className="flex gap-4 pt-4">
            <UpdateButton petProfileId={petProfile.id} />
            <DeleteButton accountId={account.id} />
          </div>
        </div>
      ) : (
        <p className="text-yellow-700">No pet profile found</p>
      )}
    </div>
  );
}
