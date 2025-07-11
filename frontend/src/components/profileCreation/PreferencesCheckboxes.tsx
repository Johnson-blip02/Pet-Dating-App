type Props = {
  preferences: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const options = ["Dog", "Cat", "Rabbit"];

export default function PreferencesCheckboxes({
  preferences,
  onChange,
}: Props) {
  return (
    <div>
      <p className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Pet Preferences
      </p>
      <div className="flex flex-wrap gap-4">
        {options.map((type) => (
          <label
            key={type}
            className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <input
              type="checkbox"
              value={type}
              checked={preferences.includes(type)}
              onChange={onChange}
              className="form-checkbox h-5 w-5 text-yellow-500 dark:text-yellow-400"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
