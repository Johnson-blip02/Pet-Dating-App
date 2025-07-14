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
  const getHelperText = () => {
    switch (name) {
      case "userName":
        return "Must be between 2 and 50 characters.";
      case "age":
        return "Enter a number between 0 and 30.";
      case "location":
        return "Required – enter your pet's location.";
      default:
        return null;
    }
  };

  const helperText = getHelperText();

  return (
    <div className="mb-4">
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
      {helperText && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
