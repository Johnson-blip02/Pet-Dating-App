type Props = {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string;
};

export default function ImageUploader({ onUpload, previewUrl }: Props) {
  return (
    <div>
      <label
        htmlFor="photo"
        className="block mb-1 font-semibold text-gray-800 dark:text-gray-200"
      >
        Profile Photo
      </label>
      <input
        type="file"
        accept="image/*"
        id="photo"
        className="w-full border border-yellow-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onChange={onUpload}
        required
      />
      {previewUrl && (
        <img
          src={`http://localhost:5074/${previewUrl}`}
          alt="Pet"
          className="w-24 h-24 rounded-full object-cover mt-3 shadow-md"
        />
      )}
    </div>
  );
}
