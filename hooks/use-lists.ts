import { useState } from 'react';
import {
  createListService,
  deleteListService,
  joinListService,
  leaveListService,
  refreshInviteTokenService
} from '@/services/list-service';
import { useShoppingListContext } from '@/context/shopping-list-context';
import { toast } from 'sonner';
import { List } from '@/types';

export const useLists = () => {
  const { fetchLists } = useShoppingListContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new list
  const createList = async (name: string): Promise<List | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const newList = await createListService(name);

      if (newList) {
        await fetchLists(); // Refresh the list
        toast.success('List created successfully!');

        return newList;
      }
    } catch (err: any) {
      setError('Error creating list: ' + err.message);
      toast.error('Error creating list: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a list
  const deleteList = async (listId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await deleteListService(listId);

      if (success) {
        await fetchLists();
        toast.success('List deleted successfully!');
      }
    } catch (err: any) {
      setError('Error deleting list: ' + err.message);
      toast.error('Error deleting list: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInviteToken = async (listId: string, refresh?: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await refreshInviteTokenService(listId, refresh);

      if (!response?.inviteToken) {
        throw new Error('Failed to create invite link');
      }

      const inviteUrl = `${window.location.origin}/list-invite/${response.inviteToken}`;
      await navigator.clipboard.writeText(inviteUrl);
      toast.success(
        refresh
          ? 'New invite link generated and copied to clipboard!'
          : 'Invite link copied to clipboard!'
      );
      return inviteUrl;
    } catch (err: any) {
      setError('Error creating invite link: ' + err.message);
      toast.error('Error creating invite link: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Join a shopping list
  const joinList = async (inviteToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await joinListService(inviteToken);

      if (!response.success || response.error) {
        throw new Error(response.error || 'Failed to join list');
      }

      await fetchLists();
      toast.success('Joined list successfully!');
    } catch (err: any) {
      setError('Error joining list: ' + err.message);
      toast.error('Error joining list: ' + err.message);
      throw err; // Re-throw to let the invite page handle the error
    } finally {
      setIsLoading(false);
    }
  };

  // Leave a shopping list
  const leaveList = async (listId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await leaveListService(listId);

      if (success) {
        await fetchLists();
        toast.success('Left list successfully!');
      }
    } catch (err: any) {
      setError('Error leaving list: ' + err.message);
      toast.error('Error leaving list: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createList,
    deleteList,
    joinList,
    leaveList,
    refreshInviteToken
  };
};
