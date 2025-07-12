type Props = {
  message: string;
  type: "error" | "success";
};

export default function FeedbackMessage({ message, type }: Props) {
  const className =
    type === "error"
      ? "text-red-600 font-medium mb-4"
      : "text-green-600 font-medium mb-4";

  return <div className={className}>{message}</div>;
}
