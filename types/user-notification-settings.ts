export interface UserNotificationSettings {
  user_id: string; // FK to User.id
  notify_on_item_added: boolean;
  notify_on_item_completed: boolean;
  notify_on_comment: boolean;
  notify_on_new_member: boolean;
  updated_at: Date;
}
