type Props = {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string;
};

export default function ImageUploader({ onUpload, previewUrl }: Props) {
  return (
    <div>
      <label htmlFor="photo" className="block mb-1 font-semibold">
        Profile Photo
      </label>
      <input
        type="file"
        accept="image/*"
        id="photo"
        className="w-full border p-2 rounded"
        onChange={onUpload}
        required
      />
      {previewUrl && (
        <img
          src={`http://localhost:5074/${previewUrl}`}
          alt="Pet"
          className="w-24 h-24 rounded-full object-cover mt-3"
        />
      )}
    </div>
  );
}
