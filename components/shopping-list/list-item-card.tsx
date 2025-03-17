import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash, Hand } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ListItem, ListItemStatus } from '@/types';
import CommentsModal from '@/components/shopping-list/modals/comments-modal';
import { useAuthContext } from '@/context/auth-context';

interface ListCardProps {
  item: ListItem;
  onDelete: () => void;
  onUpdateStatus: (status: ListItemStatus) => void;
}

const mockComments = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    user_id: 'user-123',
    item_id: 'item-456',
    content: 'This is a comment on the first item.',
    created_at: new Date('2023-01-01T10:00:00Z'),
    updated_at: new Date('2023-01-01T10:00:00Z'),
    deleted_at: null
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    user_id: 'user-456',
    item_id: 'item-789',
    content: 'This is a comment on the second item.',
    created_at: new Date('2023-02-01T11:00:00Z'),
    updated_at: new Date('2023-02-01T11:00:00Z'),
    deleted_at: null
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    user_id: 'user-789',
    item_id: 'item-012',
    content: 'This is a comment on the third item.',
    created_at: new Date('2023-03-01T12:00:00Z'),
    updated_at: new Date('2023-03-01T12:00:00Z'),
    deleted_at: null
  }
];

const ListItemCard: React.FC<ListCardProps> = ({
  item,
  onDelete,
  onUpdateStatus
}) => {
  const { user } = useAuthContext();
  const [isCompleted, setIsCompleted] = useState(
    item.status === ListItemStatus.Done
  );
  const [isAssigned, setIsAssigned] = useState(false);

  const handleCompletionToggle = () => {
    const newStatus = isCompleted
      ? ListItemStatus.Pending
      : ListItemStatus.Done;
    setIsCompleted(!isCompleted);
    onUpdateStatus(newStatus);
  };

  const handleAssignmentToggle = () => {
    setIsAssigned(!isAssigned);
    // TODO: Add assignment logic
  };

  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardContent className="flex items-center gap-3 p-3">
        {/* Checkbox for completion */}
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleCompletionToggle}
          className="h-5 w-5 border-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        />

        {/* Main Content */}
        <div className="flex flex-1 items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p
                className={`font-medium ${
                  isCompleted
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                }`}
              >
                {item.name}
              </p>
              <Avatar className="h-5 w-5">
                <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
                  {item.added_by?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
            </div>

            {item.description && (
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side Controls */}
        <TooltipProvider>
          <div className="ml-auto flex items-center gap-2">
            {/* Assign to Me */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    isAssigned ? 'text-primary' : 'text-muted-foreground/50'
                  }`}
                  onClick={handleAssignmentToggle}
                >
                  <Hand className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isAssigned ? 'Unassign from me' : 'Assign to me'}
              </TooltipContent>
            </Tooltip>

            <CommentsModal comments={mockComments} />

            {/* Delete Button */}
            {item.added_by === user?.id && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={onDelete}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default ListItemCard;
