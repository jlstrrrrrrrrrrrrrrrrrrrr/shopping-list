import { useState } from 'react';
import {
  addItemToListService,
  deleteItemFromList,
  updateItemStatus
} from '@/services/list-item-service';
import { useShoppingListContext } from '@/context/shopping-list-context';

export const useListItems = () => {
  const { selectedList } = useShoppingListContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedList) {
    return {
      isLoading,
      error,
      addItemToList: async () => {},
      deleteItem: async () => {},
      updateStatus: async () => {}
    };
  }

  // Add an item
  const addItemToList = async (name: string, description?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await addItemToListService(selectedList.id, name, description);
    } catch (err: any) {
      setError('Error adding item: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an item
  const deleteItem = async (itemId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteItemFromList(itemId);
    } catch (err: any) {
      setError('Error deleting item: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item status
  const updateStatus = async (itemId: string, status: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateItemStatus(itemId, status);
    } catch (err: any) {
      setError('Error updating item status: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, addItemToList, deleteItem, updateStatus };
};
