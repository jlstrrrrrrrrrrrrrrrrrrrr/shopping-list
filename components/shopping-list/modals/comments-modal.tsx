import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ListItemComment } from '@/types';

interface CommentsModalProps {
  comments: ListItemComment[];
}

const CommentsModal: React.FC<CommentsModalProps> = ({ comments }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Notes & Comments
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-4">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {'JL'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{comment.user_id}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input placeholder="Add a note..." />
            <Button>Post</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;
