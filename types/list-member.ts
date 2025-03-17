export enum ShoppingListRole {
  Owner = "owner",
  Member = "member",
  ReadOnly = "read-only",
}

export interface ShoppingListMember {
  id: string; // UUID
  user_id: string; // FK to User.id
  shopping_list_id: string; // FK to ShoppingList.id
  role: ShoppingListRole;
  joined_at: Date;
  last_active_at?: Date | null;
}
