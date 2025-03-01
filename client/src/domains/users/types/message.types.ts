export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  sender_first_name: string;
  sender_last_name: string;
  subject: string;
  content: string;
  sent_at: string;
  is_read: boolean;
  is_important: boolean;
}

export interface MessagesResponse {
  messages: Message[];
  unreadCount: number;
} 