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
      <p className="font-semibold mb-2">Pet Preferences</p>
      <div className="flex flex-wrap gap-4">
        {options.map((type) => (
          <label key={type} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={type}
              checked={preferences.includes(type)}
              onChange={onChange}
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
