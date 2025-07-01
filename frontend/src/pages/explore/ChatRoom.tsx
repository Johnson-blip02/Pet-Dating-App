import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getCookie } from "../../utils/cookies";
import useChatWebSocket from "../../hooks/useChatWebSocket";
import type { ChatMessage } from "../../types/chatMessage";
import { useNavigate } from "react-router-dom";

export default function ChatRoom() {
  const { otherUserId } = useParams<{ otherUserId: string }>();
  const petProfileId = getCookie("petProfileId");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  if (!petProfileId || !otherUserId) {
    return <div>Missing user information</div>;
  }

  const roomId = `room_${[petProfileId, otherUserId].sort().join("_")}`;

  // ✅ Message handler for incoming WebSocket messages
  const handleMessage = (msg: ChatMessage) => {
    if (msg.roomId !== roomId) return;

    setMessages((prev) => {
      const isResponseToTemp = prev.some(
        (m) =>
          m.id?.startsWith("temp-") &&
          m.message === msg.message &&
          m.senderId === msg.senderId
      );

      if (isResponseToTemp) {
        return [
          ...prev.filter(
            (m) => !m.id?.startsWith("temp-") || m.message !== msg.message
          ),
          msg,
        ];
      }

      if (!prev.some((m) => m.id === msg.id)) {
        return [...prev, msg];
      }

      return prev;
    });
  };

  const { sendMessage, isConnected, reconnect } = useChatWebSocket(
    "ws://localhost:5074/ws",
    petProfileId,
    otherUserId,
    roomId,
    handleMessage
  );

  useEffect(() => {
    if (!otherUserId) return;
    fetch(`http://localhost:5074/api/users/${otherUserId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [otherUserId]);

  // Load initial message history
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:5074/api/chat/room/${roomId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load chat history");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
        }
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
        setMessages([]);
      })
      .finally(() => setIsLoading(false));
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: petProfileId,
      receiverId: otherUserId,
      message: input.trim(),
      roomId,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput("");
    sendMessage(input.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b shadow-sm bg-white sticky top-0 z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/messenger")}
          className="flex items-center text-gray-700 hover:text-gray-900"
          aria-label="Back to Messenger"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </button>

        {/* User info */}
        <div className="flex items-center gap-3">
          <img
            src={`http://localhost:5074/${user?.photoPath}`}
            alt={user?.userName}
            className="h-10 w-10 rounded-full object-cover border"
          />
          <span className="font-semibold text-gray-800">{user?.userName}</span>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-grow overflow-y-auto bg-gray-100 p-4">
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

        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Loading messages...</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto space-y-2 bg-gray-100 p-4 rounded">
            {messages.length === 0 && (
              <p className="text-center text-gray-500">
                Start the conversation!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`max-w-[75%] p-2 rounded-lg ${
                  msg.senderId === petProfileId
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-300 text-black self-start mr-auto"
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
        )}
      </div>

      {/* Input box at bottom */}
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isConnected ? "Type a message" : "Connecting..."}
          className="flex-grow border rounded p-2 disabled:opacity-50"
          disabled={!isConnected || isLoading}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!isConnected || isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
