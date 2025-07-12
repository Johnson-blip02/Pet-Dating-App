import InputField from "../form/InputField";
import PhotoUpload from "./PhotoUpload";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  photoPreview: string | null;
  isSubmitting: boolean;
}

export default function ProfileForm({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  photoPreview,
  isSubmitting,
}: Props) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PhotoUpload
        formData={formData}
        photoPreview={photoPreview}
        handleFileChange={handleFileChange}
      />

      <InputField
        label="Pet Name"
        name="userName"
        value={formData.userName || ""}
        onChange={handleChange}
      />
      <InputField
        label="Age"
        name="age"
        type="number"
        value={formData.age || ""}
        onChange={handleChange}
      />
      <InputField
        label="Pet Type"
        name="petType"
        value={formData.petType || ""}
        onChange={handleChange}
      />
      <InputField
        label="Location"
        name="location"
        value={formData.location || ""}
        onChange={handleChange}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
