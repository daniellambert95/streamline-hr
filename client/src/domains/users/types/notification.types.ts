export interface Notification {
  id: number;
  recipient_id: number;
  sender_id?: number;
  sender_first_name?: string;
  sender_last_name?: string;
  type: string;
  message: string;
  is_read: boolean;
  is_reminder: boolean;
  reminder_date?: string;
  external_delivery?: {
    slack?: boolean;
    email?: boolean;
    slack_channel?: string;
    email_address?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
} 