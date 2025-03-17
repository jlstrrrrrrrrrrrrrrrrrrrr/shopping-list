export interface ListActivity {
  id: string; // UUID
  shopping_list_id: string; // FK to ShoppingList.id
  user_id: string; // FK to User.id
  activity_type: ActivityType;
  target_item_id?: string | null; // FK to ShoppingListItem.id
  target_user_id?: string | null; // FK to User.id
  details?: Record<string, any>; // JSONB for additional data
  created_at: Date;
}

// Activity Log
export enum ActivityType {
  ITEM_CREATED = "item_created",
  ITEM_UPDATED = "item_updated",
  ITEM_COMPLETED = "item_completed",
  COMMENT_ADDED = "comment_added",
  MEMBER_ADDED = "member_added",
  MEMBER_REMOVED = "member_removed",
}
