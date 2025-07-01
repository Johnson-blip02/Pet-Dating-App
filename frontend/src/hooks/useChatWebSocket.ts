import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/chatMessage";

export default function useChatWebSocket(
  url: string,
  senderId: string,
  receiverId: string,
  roomId: string,
  onMessageReceived: (msg: ChatMessage) => void
) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(`${url}?roomId=${roomId}`);
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onerror = () => setIsConnected(false);

    socket.onmessage = (event) => {
      try {
        const msg: ChatMessage = JSON.parse(event.data);
        onMessageReceived(msg);
      } catch (err) {
        console.warn("Invalid WebSocket message", event.data);
      }
    };

    return () => {
      socket.close();
    };
  }, [url, senderId, receiverId, roomId]);

  const sendMessage = (message: string) => {
    const payload = {
      senderId,
      receiverId,
      message,
      roomId,
    };
    socketRef.current?.send(JSON.stringify(payload));
  };

  const reconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  return { sendMessage, isConnected, reconnect };
}
