export interface ListItemComment {
  id: string; // UUID
  user_id: string; // FK to User.id
  item_id: string; // FK to ShoppingListItem.id
  content: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null; // Soft delete
}
