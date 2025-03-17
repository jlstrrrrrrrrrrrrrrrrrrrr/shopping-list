export interface List {
  id: string; // UUID
  name: string;
  created_by: string; // FK to User.id
  created_at: Date;
  updated_at: Date;
  archived_at?: Date | null; // Soft delete
  invite_token: string | null;
  members: ListMember[];
}

export interface ListMember {
  avatar_url: string | null;
  id: string;
  username: string | null;
}
