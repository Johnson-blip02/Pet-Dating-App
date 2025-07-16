import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookies";
import useChatWebSocket from "../../hooks/useChatWebSocket";
import type { ChatMessage } from "../../types/chatMessage";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";

export default function ChatRoomPage() {
  const { otherUserId } = useParams<{ otherUserId: string }>();
  const petProfileId = getCookie("petProfileId");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const wsUrl = import.meta.env.VITE_WS_URL;

  if (!petProfileId || !otherUserId) {
    return <div>Missing user information</div>;
  }

  const roomId = `room_${[petProfileId, otherUserId].sort().join("_")}`;

  const handleMessage = (msg: ChatMessage) => {
    if (msg.roomId !== roomId) return;

    setMessages((prevMessages) => {
      const isResponseToTemp = prevMessages.some(
        (m) =>
          m.id?.startsWith("temp-") &&
          m.message === msg.message &&
          m.senderId === msg.senderId
      );

      if (isResponseToTemp) {
        return [
          ...prevMessages.filter(
            (m) => !(m.id?.startsWith("temp-") && m.message === msg.message)
          ),
          msg,
        ];
      }

      if (!prevMessages.some((m) => m.id === msg.id)) {
        return [...prevMessages, msg];
      }

      return prevMessages;
    });
  };

  const { sendMessage, isConnected, reconnect } = useChatWebSocket(
    `${wsUrl}/ws`,
    petProfileId,
    otherUserId,
    roomId,
    handleMessage
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/${otherUserId}`);
        if (!res.ok) {
          setUserNotFound(true);
          setIsUserDeleted(true);
          return;
        }
        const data = await res.json();
        if (!data) {
          setUserNotFound(true);
          setIsUserDeleted(true);
          return;
        }
        setUser(data);
        setIsUserDeleted(false);
      } catch (err) {
        console.error("User fetch failed:", err);
        setUserNotFound(true);
        setIsUserDeleted(true);
      }
    };

    if (otherUserId) fetchUser();
  }, [apiUrl, otherUserId]);

  useEffect(() => {
    if (isUserDeleted) return;

    setIsLoading(true);
    fetch(`${apiUrl}/chat/room/${roomId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load chat history");
        return res.json();
      })
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
        setMessages([]);
      })
      .finally(() => setIsLoading(false));
  }, [apiUrl, roomId, isUserDeleted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isUserDeleted || !isConnected) return;

    try {
      const res = await fetch(`${apiUrl}/users/${otherUserId}`);
      if (!res.ok) {
        setIsUserDeleted(true);
        setUserNotFound(true);
        return;
      }

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
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  if (userNotFound || isUserDeleted) {
    return (
      <div className="flex items-center justify-center h-screen text-center p-4">
        <div>
          <p className="text-xl font-semibold text-red-600">
            The user you're trying to chat with no longer exists.
          </p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/messenger")}
          >
            Go Back to Messenger
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <ChatHeader user={user} />
      <ChatMessages
        messages={messages}
        petProfileId={petProfileId}
        isConnected={isConnected}
        isLoading={isLoading}
        reconnect={reconnect}
        bottomRef={bottomRef}
      />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isDisabled={!isConnected || isLoading || isUserDeleted}
        onKeyPress={handleKeyPress}
        placeholder={isUserDeleted ? "User no longer exists" : "Type a message"}
      />
    </div>
  );
}
