type Props = {
  id: string;
  label: string;
  type: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export default function FormInput({
  id,
  label,
  type,
  name,
  value,
  onChange,
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
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full border border-yellow-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />
    </div>
  );
}
