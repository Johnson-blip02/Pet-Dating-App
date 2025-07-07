interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isDisabled: boolean;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
}

export default function ChatInput({
  input,
  setInput,
  handleSend,
  isDisabled,
  onKeyPress,
  placeholder = "Type a message",
}: ChatInputProps) {
  return (
    <div className="flex gap-2 mt-4 p-4 border-t bg-white">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className="flex-grow border rounded p-2 disabled:opacity-50"
        disabled={isDisabled}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isDisabled}
      >
        Send
      </button>
    </div>
  );
}
