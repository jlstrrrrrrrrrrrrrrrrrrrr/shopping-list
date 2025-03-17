import { useEffect, useState } from 'react';
import { List } from '@/types';
import { useLists } from '@/hooks/use-lists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Share2, RefreshCw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareListModalProps {
  list: List;
  trigger?: React.ReactNode;
}

export const ShareListModal = ({ list, trigger }: ShareListModalProps) => {
  const { refreshInviteToken, isLoading } = useLists();
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set the invite URL from the list's token
  useEffect(() => {
    if (isModalOpen && list.invite_token) {
      setInviteUrl(
        `${window.location.origin}/list-invite/${list.invite_token}`
      );
    }
  }, [isModalOpen, list.invite_token]);

  const handleRefresh = async () => {
    const url = await refreshInviteToken(list.id, true);

    if (url) {
      setInviteUrl(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyToClipboard = async () => {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'hover:bg-primary hover:text-primary-foreground',
              isLoading && 'pointer-events-none opacity-50'
            )}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{list.name}"</DialogTitle>
          <DialogDescription>
            Share this list with others by sending them the invite link below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={inviteUrl}
                readOnly
                className="w-full font-mono text-sm"
              />
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
              disabled={!inviteUrl || isLoading}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Anyone with this link can join your list. Generate a new link to
              invalidate the current one.
            </p>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <RefreshCw
                className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')}
              />
              Generate New Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
