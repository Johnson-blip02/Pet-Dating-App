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
          className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-2" />
      )}
      <label className="text-blue-600 cursor-pointer hover:underline">
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
