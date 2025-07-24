import type { ChatMessage } from "../../types/chatMessage";
import type { RefObject } from "react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  petProfileId: string;
  isConnected: boolean;
  isLoading: boolean;
  reconnect: () => void;
  bottomRef: RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  petProfileId,
  isConnected,
  isLoading,
  reconnect,
  bottomRef,
}: ChatMessagesProps) {
  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto bg-light-background dark:bg-dark-background p-4">
      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded flex justify-between items-center">
          <span>Disconnected from chat</span>
          <button
            onClick={reconnect}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Reconnect
          </button>
        </div>
      )}

      <div className="space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Start the conversation!
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            className={`max-w-[75%] p-2 rounded-lg ${
              msg.senderId === petProfileId
                ? "bg-light-accent text-light-text self-end ml-auto dark:bg-dark-accent dark:text-dark-text"
                : "bg-light-secondary-text text-light-text self-start mr-auto dark:bg-dark-background dark:text-dark-text"
            }`}
          >
            <p className="text-sm">{msg.message}</p>
            <p className="text-xs text-right opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
