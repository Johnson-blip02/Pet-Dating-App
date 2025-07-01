export interface ChatMessage {
  id?: string;
  roomId?: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}
