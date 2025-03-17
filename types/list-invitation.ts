export interface ListInvitation {
  id: string; // UUID
  shopping_list_id: string; // FK to ShoppingList.id
  invited_by_user_id: string; // FK to User.id
  invited_user_email: string;
  token: string; // Unique invitation token
  status: 'pending' | 'accepted' | 'declined';
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

// composite key

export interface ListInvite {
  id: string;
  invite_token: string;
  list_id: string;
  created_by: string;
  expires_at: string;
  created_at: string;
}
