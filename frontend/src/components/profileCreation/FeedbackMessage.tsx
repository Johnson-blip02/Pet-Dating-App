type Props = {
  message: string;
  type: "error" | "success";
};

export default function FeedbackMessage({ message, type }: Props) {
  const baseClasses = "font-medium mb-4 p-3 rounded";
  const className =
    type === "error"
      ? `${baseClasses} bg-red-100 text-red-700 border border-red-300`
      : `${baseClasses} bg-green-100 text-green-700 border border-green-300`;

  return (
    <div role="alert" className={className}>
      {message}
    </div>
  );
}
