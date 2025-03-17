export interface ListItem {
  id: string;
  name: string;
  description?: string;
  shopping_list_id: string;
  added_by: string;
  assigned_to?: string | null;
  status: ListItemStatus;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date | null;
}

export enum ListItemStatus {
  Open = 'open',
  Pending = 'pending',
  Done = 'done'
}
