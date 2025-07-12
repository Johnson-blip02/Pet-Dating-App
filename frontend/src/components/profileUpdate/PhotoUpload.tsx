import type { PetProfile } from "../../types/petProfile";

interface Props {
  photoPreview: string | null;
  formData: Partial<PetProfile>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PhotoUpload({
  formData,
  photoPreview,
  handleFileChange,
}: Props) {
  const displayImage =
    photoPreview ||
    (formData.photoPath ? `http://localhost:5074/${formData.photoPath}` : null);

  return (
    <div className="text-center">
      {displayImage ? (
        <img
          src={displayImage}
          alt="Pet"
          className="w-32 h-32 object-cover rounded-full mx-auto mb-2 border-4 border-yellow-400 dark:border-yellow-500"
        />
      ) : (
        <div className="w-32 h-32 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-2" />
      )}
      <label className="text-yellow-600 dark:text-yellow-400 cursor-pointer hover:underline">
        Change Photo
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>
    </div>
  );
}
