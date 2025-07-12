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
    <div className="flex gap-2 mt-4 p-4 border-t bg-light-background dark:bg-dark-border">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className="flex-grow border border-light-muted rounded p-2 disabled:opacity-50 focus:ring-2 focus:ring-light-accent focus:border-light-accent transition"
        disabled={isDisabled}
      />
      <button
        onClick={handleSend}
        className="bg-light-accent text-white px-4 rounded hover:bg-light-accent-hover disabled:opacity-50 transition"
        disabled={isDisabled}
      >
        Send
      </button>
    </div>
  );
}
