import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trash, Settings, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { List } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useLists } from '@/hooks/use-lists';
import DeleteListModal from '@/components/shopping-list/modals/delete-list-modal';
import { ShareListModal } from './modals/share-list-modal';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useAuthContext } from '@/context/auth-context';

interface ListCardProps {
  list: List;
}

const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const { user } = useAuthContext();
  const { deleteList, leaveList } = useLists();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'delete' | 'leave'>(
    'delete'
  );

  const isOwner = list.created_by === user?.id;

  const handleDelete = () => {
    deleteList(list.id);
    setIsDialogOpen(false);
  };

  const handleLeave = () => {
    leaveList(list.id);
    setIsDialogOpen(false);
  };

  const handleAction = () => {
    if (dialogAction === 'delete') {
      handleDelete();
    } else {
      handleLeave();
    }
  };

  return (
    <Card className="h-full border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-3 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">
            {list?.name}
          </h3>

          <div className="flex items-center gap-2">
            <ShareListModal list={list} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner ? (
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-600"
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      setDialogAction('delete');
                      setIsDialogOpen(true);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete List</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-600"
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      setDialogAction('leave');
                      setIsDialogOpen(true);
                    }}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Leave List</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div className="flex -space-x-2">
            {list?.members?.map((member, index) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-card">
                <AvatarImage src={member.avatar_url ?? ''} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {member.username
                    ? member.username[0].toUpperCase()
                    : index + 1}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        {/* Confirmation Dialog */}
        <DeleteListModal
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          title={dialogAction === 'delete' ? 'Delete List?' : 'Leave List?'}
          description={
            dialogAction === 'delete'
              ? `This will permanently delete the list "${list.name}" and all its items.`
              : `Are you sure you want to leave "${list.name}"? You'll need a new invitation to rejoin.`
          }
          onConfirm={handleAction}
        />
      </CardContent>
    </Card>
  );
};

export default ListCard;
