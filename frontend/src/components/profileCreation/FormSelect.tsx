type Props = {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
};

export default function FormSelect({
  id,
  label,
  name,
  value,
  onChange,
  options,
  required,
}: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1 font-semibold text-gray-800 dark:text-gray-200"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-yellow-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
