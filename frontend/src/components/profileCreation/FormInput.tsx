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
      <label htmlFor={id} className="block mb-1 font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}
